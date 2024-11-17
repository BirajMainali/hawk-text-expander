const promptlyStorage = ({
                             identifier = 'hawk__shortcut_storage',
                         } = {
    identifier: 'hawk__shortcut_storage',
}) => {

    const getData = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([identifier], (result) => {
                const data = result[identifier] || [];
                resolve(data);
            });
        });
    };

    const setData = (data) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({[identifier]: data}, () => {
                resolve();
            });
        });
    };

    return {
        getAll: () => {
            return getData();
        },

        get: (key) => {
            return getData().then(data => data.find(item => item.key === key));
        },

        set: (key, value) => {
            return getData().then(data => {
                const index = data.findIndex(item => item.key === key);
                if (index === -1) {
                    data.push({key, value});
                } else {
                    data[index].value = value;
                }
                return setData(data);
            });
        },

        remove: (key) => {
            return getData().then(data => {
                const index = data.findIndex(item => item.key === key);
                if (index !== -1) {
                    data.splice(index, 1);
                }
                return setData(data);
            });
        },
    };
};
