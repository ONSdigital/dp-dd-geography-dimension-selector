export function findOptionsByType ({options, type}) {
    return options.filter(option => {
        return option.type === type
    });
}

export function updateOption ({options, id, update}) {
    let retOption = null;
    let index = 0;

    if (!update instanceof Object) {
        throw new Error("Update property is expected to be an object");
    }

    while (!retOption && index < options.length) {
        const option = options[index];
        if (option.id == id) {
            options[index] = Object.assign(option, options[index], update);
            retOption = options[index];
        }
        if (option.options) {
            retOption = updateOption({ options: option.options, id, update});
        }
        index++;
    }


    return retOption;
}

export function findOptionsByParentID ({options, id}) {
    let retOptions = null;
    let index = 0;

    while (!retOptions && index < options.length) {
        const option = options[index];
        if (option.id === id) {
            return option.options;
        }
        if (option.options) {
            retOptions = findOptionsByParentID({ options: option.options, id });
        }
        index++;
    }

    return retOptions;
}

export function filterOptions({options, filter = {}}) {
    const keys = Object.keys(filter);
    return options.filter(option => {
        let matches = true;
        keys.forEach( key => {
            if (option[key] !== filter[key]) {
                matches = false;
            }
        })
        return matches;
    }).map(option => {
        option = Object.assign({}, option);
        delete option.options;
        return option;
    });
}

export function renderFlatHierarchy ({ hierarchy, filter = {} }) {
    const list = [];
    if (!hierarchy instanceof Array) {
        hierarchy = [hierarchy];
    }

    hierarchy.forEach(element => {
        if (element.options) {
            list.push(Object.assign({}, element, {
                options: filterOptions({options: element.options, filter})
            }));

            Array.prototype.push.apply(list, renderFlatHierarchy({
                hierarchy: element.options,
                filter
            }));
        }
    })
    return list;
}