Object.filter = function (mainObject, filterFunction) {
    return Object.keys(mainObject)
        .filter(function (ObjectKey) {
            return filterFunction(mainObject[ObjectKey])
        })
        .reduce(function (result, ObjectKey) {
            result[ObjectKey] = mainObject[ObjectKey];
            return result;
        }, {});
}