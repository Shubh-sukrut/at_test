export function uniqueArrayOfObject(array, key) {
    return array.reduce((uniqueArray, currentItem) => {
        const index = key ? uniqueArray.findIndex(item => item[key] === currentItem[key]) : uniqueArray.findIndex(item => JSON.stringify(item) === JSON.stringify(currentItem));
        if (index === -1) {
            uniqueArray.push(currentItem);
        }
        return uniqueArray;
    }, []);
}
