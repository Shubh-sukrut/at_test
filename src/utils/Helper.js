
export const remove_duplicate_msg = (msg_arr) => {
    const uniquedates = [];

    const filteredMessagesArray = msg_arr.filter((message) => {
        const { year, month, day } = message._id;

        const dateKey = `${year}-${month}-${day}`;

        if (!uniquedates.includes(dateKey)) {
            uniquedates.push(dateKey);
            return true;
        }
        return false;
    });
    return filteredMessagesArray
}

export const mergeMessagesByDate = (messages) => {
    const mergedMessages = {};

    messages.forEach((dayData) => {
        const { _id, messages } = dayData;
        const { year, month, day } = _id;
        const key = `${year}-${month}-${day}`;
        if (!mergedMessages[key]) {
            mergedMessages[key] = {
                _id: { year, month, day },
                messages: [],
            };
        }

        mergedMessages[key].messages = mergedMessages[key].messages.concat(messages);
    });

    return Object.values(mergedMessages);
}
