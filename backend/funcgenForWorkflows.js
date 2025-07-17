// sample workflow

sampleWorkflow = {
    trigger: {
        nodeId: "abc",
        action: "onClick"
    },
    actionGraphLinear: [
        {
            type: 'datafetcher',
            db: 'cards',
            params: [2]
        },
        {
            type: 'stateChangeHandler',
            stateName: 'cardsData',
            stateChange: 'append:node1:data'
        }
    ]
}

// Todo: make a decision whether the backend will be gen on a per user basis or a centralized controlled backend
const serverBaseUri = process.env.BACKEND_URI

const dataFetchingHof = (dbName, queryOpts, transformOpts) => {
    const func = async () => {
        const data = await fetch(`${serverBaseUri}/fetchFromDb/${dbName}`)
        return data;
    }

    return func
}

export const higherOrderfunction = (workflow) => {

    const funcCalls = []

    for (let actionItem of workflow.actionGraphLinear) {
        if (actionItem.type === "datafetcher") {
            // todo: sync the params, shift to ts?
            funcCalls.push(dataFetchingHof(actionItem.db))
        } else if (actionItem.type === "stateChangeHandler") {

        } else {

        }
    }

    return funcCalls
}