/*
Mapping algorithm to get the raw data into the different Plots.
 */

export function generateTreeObject(filters, rawData) {
    const enabledFilters = filters.filter(filter => filter.enabled);
    return {name: 'Landscape', children: generateTreeObjectInternal(enabledFilters, rawData)}
}

function generateTreeObjectInternal(filters, rawData) {
    let result = []
    let currentFilter = {}
    let remainingFilters = filters

    // only use enabled filters
    do {
        if (remainingFilters.length === 0) {
            return
        }
        currentFilter = remainingFilters[0]
        remainingFilters = remainingFilters.slice(1)
    } while (currentFilter.enabled === false)

    let distinctAttributes = retrieveDistinctAttributes(currentFilter, rawData)

    for (let item of distinctAttributes) {

        let entry = {name: item}

        if (remainingFilters.length !== 0) {
            let subdata = filterAttributes(currentFilter, rawData, item)
            entry.children = generateTreeObjectInternal(remainingFilters, subdata)
        } else {
            entry.value = 1
        }

        result.push(entry)
    }

    return result;
}

function filterAttributes(currentFilterPointer, rawData, currentFilter) {
    let values = []

    for (let item of rawData) {
        if (item[currentFilterPointer.name] === currentFilter) {
            values.push(item)
        }
    }

    return values;
}

function retrieveDistinctAttributes(currentFilter, rawData) {
    let distinctValues = new Set()

    for (let item of rawData) {
        distinctValues.add(item[currentFilter.name])
    }

    return distinctValues;
}

/*
Normalise algorithm to get the data into the different Plots.
 */
export function normaliseList(rawData) {
    let result = []
    let finishflag = true

    for (let entry in rawData) {
        let currentDataIndex = entry
        let noArray = true
        entry = rawData[entry]
        for (let item in entry) {
            if (Array.isArray(entry[item])) {
                noArray = false
                for (let object in entry[item]) {
                    let clone = JSON.parse(JSON.stringify(entry));
                    clone[item] = entry[item][object];
                    result.push(clone);
                }
                finishflag = false
            }
        }

        if (noArray) {
            result.push(JSON.parse(JSON.stringify(entry)))
        }
    }

    if (!finishflag) {
        return normaliseList(result)
    }

    return result;
}

/*
Aggregation algorithm to get the data into the different Plots.
 */
export function aggregateList(rawData) {
    let data = JSON.parse(JSON.stringify(rawData))

    for (let entry in data) {
        entry = data[entry]
        for (let item in entry) {
            if (Array.isArray(entry[item])) {
                entry[item] = entry[item].join('-');
            }
        }
    }

    return data;
}

/*
Calculate links and nodes for network Plot
 */
export function generateNetworkLinks(rawData) {
    let result = []

    rawData.forEach(entry => {
        result.push({source: "Name: " + entry.Name, target: "Publisher: " + entry.Publisher})

        entry.Standards.forEach(item => {
            result.push({source: "Name: " + entry.Name, target: "Standard: " + item})
        })
        entry.Abilities.forEach(item => {
            result.push({source: "Name: " + entry.Name, target: "Ability: " + item})
        })
    })

    return result;
}

export function generateNetworkNodes(rawData) {
    let nameSet = new Set()
    let publisherSet = new Set()
    let standardsSet = new Set()
    let abilitiesSet = new Set()
    let result = []

    rawData.forEach(entry => {
        nameSet.add("Name: " + entry.Name)
        publisherSet.add("Publisher: " + entry.Publisher)
        entry.Standards.forEach(item => {
            standardsSet.add("Standard: " + item)
        })
        entry.Abilities.forEach(item => {
            abilitiesSet.add("Ability: " + item)
        })
    })

    nameSet.forEach(entry => {
        result.push({id: entry, group: 1})
    })
    publisherSet.forEach(entry => {
        result.push({id: entry, group: 2})
    })
    standardsSet.forEach(entry => {
        result.push({id: entry, group: 3})
    })
    abilitiesSet.forEach(entry => {
        result.push({id: entry, group: 4})
    })

    return result;
}