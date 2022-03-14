const mock = {

    delay: 500,
    count: 100,
    statuses : ['Revoked','Approved','Expired'],

    sleep: async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    shuffle: (array) => {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    },


    getItems: (skipCount, count) => {
        return Array.from(Array(count)).reduce((accumulator, _, index) => {
            const id = index + skipCount + 1;

            let today = new Date();

            const date = new Date(
                today.getFullYear(),
                Math.floor(today.getMonth()),
                Math.floor(Math.random() * today.getDate())+1
            );
            const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
            const m = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
            const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

            accumulator[index] = {
                participantId:id,
                consentVersion: `V ${Math.floor(Math.random() * 3 + 1)}.0`,
                consentStatus:mock.statuses[Math.floor(Math.random() * mock.statuses.length )],
                consentDate: `${d}-${m}-${y}`,
            };
            return accumulator;
        }, []);
    },

    getDynamicConsentsStorage: () => {
        return {
            countRecordsAsync: async () => {
                await mock.sleep(mock.delay);
                return mock.count;
            },

            filterRecordsAsync: async (...props) => {
                await mock.sleep(mock.delay);
                return mock.getItems(...props);
            },
        };
    },
};


export default mock;