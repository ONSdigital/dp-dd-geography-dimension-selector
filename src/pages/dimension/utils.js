export function findOptionsByType ({options, type}) {
    return options.filter(option => {
        return option.type === type
    });
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