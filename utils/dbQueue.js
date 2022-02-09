/** import */
const { LIMITER_MAX_COUNT } = require("../const/const");

/** class */
class DBQueue {
    constructor(concurrent) {
        this.actQueue = [];
        this.concurrent = concurrent; // 최대 동시 접근자
    }

    add(param) {
        this.actQueue.push(param);
    }

    initialize() {
        let concurrent = [];
        for (let i = 0; i < this.concurrent; i++) {
            concurrent.push(true);
        }

        this.concurrent = concurrent;
    }

    process() {
        for (let idx = 0; idx < this.concurrent.length; idx++) {
            let val = this.concurrent[idx];

            if (val == true) {
                this.concurrent[idx] = false;
                this.ready(idx);
                break;
            }
        }
    }

    ready(available) {
        return new Promise(async (resolve) => {
            while (true) {
                if (this.actQueue.length == 0) {
                    this.concurrent[available] = true;
                    return resolve();
                } else {
                    await this.execute();
                }
            }
        });
    }

    async execute() {
        let ps = this.actQueue.shift();
        await ps();
    }

    createWrap(func) {
        return func;
    }
}

/** Instance */
const queue = new DBQueue(LIMITER_MAX_COUNT);
queue.initialize();

/**
 * @description 데이터베이스에 접근할 경우 동시 접속을 제한하고, 제한된 동시 접속 수의 병렬 처리를 위해 큐에 삽입합니다.
 * @param func 큐에 넣을 함수를 호출받습니다.
 */
function addQueueAndProcess(func) {
    queue.add(queue.createWrap(func));
    queue.process();
}

module.exports.addQueueAndProcess = addQueueAndProcess;
