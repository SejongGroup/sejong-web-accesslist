const { addQueueAndProcess } = require("../utils/dbQueue");

// let queue = new DBQueue(3);
// queue.initialize();

function createSetTimeout(ms) {
    return new Promise(function (resolve) {
        setTimeout(() => {
            console.log(ms);
            resolve("end");
        }, ms);
    });
}

// queue.add(
//     queue.createWrap(async () => {
//         return createSetTimeout(1000).then((val) => {
//             console.log(val);
//         });
//     })
// );

// queue.process();

addQueueAndProcess(async () => {
    await createSetTimeout(1000).then((val) => {
        return console.log(val);
    });

    return "is end";
});
