import numpy as np

def getDefault():
    # map parameter names to parameter vector P
    mapP={
        "WMforget": 0,
        "WMcapacity":1,
        "WMweight": 2,
        "WMbias-": 3,
        "Qlr+": 4,
        "Qlr-": 5,
        "stickiness":6,
        "invTemperature": 7,
        "epsilon": 8
    }
    # map distinct type of hidden variables to vector X
    mapX={
        "Qrl": None,
        "Vwm": None,
        "lastA": None
    }
    # context dictionary (current situation of the agent)
    C={
        "setSize": None,
        "A": None,
        "S": None,
        "R": None,
        "newA": None,
    }
    # settings
    settings={
        "interactionRLWM": True,
        "nActions": 3
    }
    # some initial parameter values for quick simulation
    initP={
        "WMforget": 0.05,
        "WMcapacity":3,
        "WMweight": 0.75,
        "Qlr+": 0.1,
        "Qlr-": 0.05,
        "WMbias-": 0.85,
        "stickiness":0.1,
        "invTemperature": 20,
        "epsilon": 0.05
    }
    # return everything
    return {"mapP": mapP, "mapX": mapX, "C": C, "settings": settings, "initP": initP}




    
def initX(nActions=3,setSize=2):

    X0 = np.zeros((0,))
    mapX = {}
    #
    Qrl = np.ones((setSize, nActions))/nActions
    mapX['Qrl'] = X0.size + np.arange(setSize * nActions).reshape((setSize, nActions))
    X0 = np.concatenate([X0, Qrl.flatten()])
    #
    Vwm = np.ones((setSize, nActions))/nActions
    mapX['Vwm'] = X0.size + np.arange(setSize * nActions).reshape((setSize, nActions))
    X0 = np.concatenate([X0, Vwm.flatten()])

    lastA = np.zeros((nActions,))
    mapX['lastA'] = X0.size + np.arange(nActions).reshape((nActions,))
    X0 = np.concatenate([X0, lastA])

    return X0,mapX

def updateOld(P,X,
               mapP={},
               mapX={},
               C={},
               settings={},
):
    
    # decay working memory
    X[mapX["Vwm"]] = X[mapX["Vwm"]] + P[mapP["WMforget"]]*(1/settings["nActions"] - X[mapX["Vwm"]])

    # determine if RPE is based on RL expectation only, or also WM value
    if settings["interactionRLWM"]:
        wint = P[mapP["WMweight"]]*min(1,P[mapP["WMcapacity"]]/C["setSize"])
    else:
        wint = 0

    # compute PE
    RPE = C["R"]-(wint*X[mapX["Vwm"]][C["S"],C["A"]] + (1-wint)*X[mapX["Qrl"]][C["S"],C["A"]])
    
    # success/fail logics
    if C["R"]>0:
        alphaRL=P[mapP["Qlr+"]]
        alphaWM=1.0
        binaryR=1
    else:
        alphaRL=P[mapP["Qlr-"]]
        alphaWM=P[mapP["WMbias-"]]
        binaryR=0

    # update RL
    X[mapX["Qrl"]][C["S"],C["A"]] = X[mapX["Qrl"]][C["S"],C["A"]] + alphaRL*RPE

    # update WM
    X[mapX["Vwm"]][C["S"],C["A"]] = X[mapX["Vwm"]][C["S"],C["A"]] + alphaWM*(binaryR-X[mapX["Vwm"]][C["S"],C["A"]])

    # update lastA
    X[mapX["lastA"]]*=0
    X[mapX["lastA"]][C["A"]]=1

    return X

def update(P, X, mapP={}, mapX={}, C={}, settings={}):

    nActions = settings["nActions"]
    setSize = C["setSize"]

    Qrl = X[mapX["Qrl"]] 
    Vwm = X[mapX["Vwm"]] 
    lastA = X[mapX["lastA"]]

    # decay working memory
    Vwm += P[mapP["WMforget"]] * (1/nActions - Vwm)

    # determine weight
    wint = P[mapP["WMweight"]] * min(1, P[mapP["WMcapacity"]] / setSize) if settings["interactionRLWM"] else 0

    # compute prediction error
    RPE = C["R"] - (wint * Vwm[C["S"], C["A"]] + (1 - wint) * Qrl[C["S"], C["A"]])

    if C["R"] > 0:
        alphaRL = P[mapP["Qlr+"]]
        alphaWM = 1.0
        binaryR = 1
    else:
        alphaRL = P[mapP["Qlr-"]]
        alphaWM = P[mapP["WMbias-"]]
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

def act(P,X,
    mapP={},
    mapX={},
    C={},
    settings={},
):
    # get hidden states
    Vwm=X[mapX["Vwm"]]
    Qrl=X[mapX["Qrl"]]
    lastA=X[mapX["lastA"]]

    # compute RL probability of choosing each action given the model
    logitsRL=P[mapP["invTemperature"]]*(Qrl[C["S"],:]+lastA*P[mapP["stickiness"]])
    probsRL= P[mapP["epsilon"]]/settings["nActions"] + (1-P[mapP["epsilon"]])*np.exp(logitsRL)/np.sum(np.exp(logitsRL))

    # compute WM probability of choosing each action given the model
    logitsWM=P[mapP["invTemperature"]]*Vwm[C["S"],:]
    probsWM= P[mapP["epsilon"]]/settings["nActions"] + (1-P[mapP["epsilon"]])*np.exp(logitsWM)/np.sum(np.exp(logitsWM))

    # integrate WM and RL into the final policy
    policy=P[mapP["WMweight"]]*probsWM+(1-P[mapP["WMweight"]])*probsRL

    # compute log-likehood of the new action (for fitting)
    logLik=np.log(policy[C["newA"]])

    return policy,logLik


    
    


