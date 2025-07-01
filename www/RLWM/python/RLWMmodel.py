def identify():
    return "RLWMmodel"

def getPriors():
        # some initial parameter values for quick simulation
    priorP={
        "WMforget": {
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.025,0.5,1.0]
        }            ,
        "WMcapacity":{
            "type": "Trapezoidal",
            "hyperparams":[1.0,1.5,3.5,6.0]
        },
        "WMweight":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.1,0.9,1.0]
        },
        "Qlr+":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.01,0.99,1.0]
        },
        "Qlr-":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.01,0.99,1.0]
        },
        "WMbias-":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.5,0.99,1.0]
        },
        "stickiness":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.01,0.99,1.0]
        },
        "invTemperature":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.5,10.0,50.0]
        },
        "epsilon":{
            "type": "Trapezoidal",
            "hyperparams":[0.0,0.01,0.5,1.0]
        },               
    }
    return priorP

def getMapParam(modelSpec):
    free_count=0
    mapP={}
    for paramName, paramStruct in modelSpec["parameters"].items():
        paramType=paramStruct.split("_")[0]
        if paramType=="free":
            mapP[paramName]=int(free_count)
            free_count+=1
        elif paramType=='mirror':
            mapP[paramName]=paramStruct.split("_")[1]
        elif paramType=='fixed':
            mapP[paramName]=float(paramStruct.split("_")[1])
        else:
            print("unknow parameter type ", paramType)

    return mapP


def getParamDict(P,mapP):
    # map parameter names to parameter vector P
    dictP={}
    for paramName, value in mapP.items():
        if isinstance(value,int):
            dictP[paramName]=P[value]
        elif isinstance(value,str):
            dictP[paramName]=P[mapP[value]]
        elif isinstance(value,str):
            dictP[paramName]=value
    # return everything
    return dictP

    
def initX(nActions=3,setSize=2,variables=["Qrl","Vwm","lastA"]):

    X0 = np.zeros((0,))
    mapX = {}
    #
    if "Qrl" in variables:
        Qrl = np.ones((setSize, nActions))/nActions
        mapX['Qrl'] = X0.size + np.arange(setSize * nActions).reshape((setSize, nActions))
        X0 = np.concatenate([X0, Qrl.flatten()])
    #
    if "Vwm" in variables:
        Vwm = np.ones((setSize, nActions))/nActions
        mapX['Vwm'] = X0.size + np.arange(setSize * nActions).reshape((setSize, nActions))
        X0 = np.concatenate([X0, Vwm.flatten()])

    if "lastA" in variables:
        lastA = np.zeros((nActions,))
        mapX['lastA'] = X0.size + np.arange(nActions).reshape((nActions,))
        X0 = np.concatenate([X0, lastA])

    return X0,mapX

# def update(P, X, mapP={}, mapX={}, C={}, settings={}):
def update(X, dictP={}, mapX={}, C={}, settings={}):

    nActions = settings["nActions"]
    setSize = C["setSize"]

    Qrl = X[mapX["Qrl"]] 
    Vwm = X[mapX["Vwm"]] 
    lastA = X[mapX["lastA"]]

    """
    dictP={}
    for paramName, value in mapP.items():
        if isinstance(value,int):
            dictP[paramName]=P[value]
        elif isinstance(value,str):
            dictP[paramName]=P[mapP[value]]
        elif isinstance(value,str):
            dictP[paramName]=value
    """

    # decay working memory
    Vwm += dictP["WMforget"] * (1/nActions - Vwm)

    # determine weight
    wint = dictP["WMweight"] * min(1, dictP["WMcapacity"] / setSize) if settings["interactionRLWM"] else 0

    # compute prediction error
    RPE = C["R"] - (wint * Vwm[C["S"], C["A"]] + (1 - wint) * Qrl[C["S"], C["A"]])

    if C["R"] > 0:
        alphaRL = dictP["Qlr+"]
        alphaWM = 1.0
        binaryR = 1
    else:
        alphaRL = dictP["Qlr-"]
        alphaWM = dictP["WMbias-"]
        binaryR = 0

    # update RL
    Qrl[C["S"], C["A"]] += alphaRL * RPE

    # update WM
    Vwm[C["S"], C["A"]] += alphaWM * (binaryR - Vwm[C["S"], C["A"]])

    # update lastA
    lastA[:] = 0
    lastA[C["A"]] = 1

    # Write the updated values back to X
    X[mapX["Qrl"].flatten()] = Qrl.flatten()
    X[mapX["Vwm"].flatten()] = Vwm.flatten()
    X[mapX["lastA"].flatten()] = lastA

    return X

# def act(P,X,mapP={},mapX={},C={},settings={}):
def act(X,dictP={},mapX={},C={},settings={}):

    # get hidden states
    Vwm=X[mapX["Vwm"]]
    Qrl=X[mapX["Qrl"]]
    lastA=X[mapX["lastA"]]


    """
    dictP={}
    for paramName, value in mapP.items():
        if isinstance(value,int):
            dictP[paramName]=P[value]
        elif isinstance(value,str):
            dictP[paramName]=P[mapP[value]]
        elif isinstance(value,str):
            dictP[paramName]=value
    """

    # compute RL probability of choosing each action given the model
    logitsRL=dictP["invTemperature"]*(Qrl[C["S"],:]+lastA*dictP["stickiness"])
    probsRL= dictP["epsilon"]/settings["nActions"] + (1-dictP["epsilon"])*np.exp(logitsRL)/np.sum(np.exp(logitsRL))

    # compute WM probability of choosing each action given the model
    logitsWM=dictP["invTemperature"]*Vwm[C["S"],:]
    probsWM= dictP["epsilon"]/settings["nActions"] + (1-dictP["epsilon"])*np.exp(logitsWM)/np.sum(np.exp(logitsWM))

    # integrate WM and RL into the final policy
    policy=dictP["WMweight"]*probsWM+(1-dictP["WMweight"])*probsRL

    # compute log-likehood of the new action (for fitting)
    logLik=np.log(policy[C["newA"]])

    return policy,logLik



    


