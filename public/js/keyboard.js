let backspace = document.getElementById("backspace");
let valuespace = document.getElementById("valuespace");
let valueplaceholder = document.getElementById("valueplaceholder");
let block = document.getElementsByClassName("block");
let loading = document.getElementById("loading");
let wrapAccess = document.getElementById("wrap-access");
let finish = document.getElementById("finish");

let success = false;

backspace.addEventListener("click", (e) => {
    let check = valuespace.innerHTML;

    valuespace.innerHTML = valuespace.textContent.substring(0, valuespace.textContent.length - 1);

    if (check.length > 1) {
        valueplaceholder.style.display = "none";
    } else {
        valueplaceholder.style.display = "initial";
    }
});

for (let i = 0; i < block.length; i++) {
    block.item(i).addEventListener("click", (e) => {
        let value = e.target.textContent;
        let check = valuespace.innerHTML;
        let authKey = document.getElementById("authKey").value;

        if (value === "취소") {
            valuespace.innerHTML = "";
        } else if (value === "전송") {
            /** 전송 */
            if (check.length !== 4) {
                alert("4자리를 입력해주세요");
            } else {
                loading.classList.remove("off");
                let data = { authKey: authKey, accessCode: check };
                fetch("/jongsungogo", {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.success) {
                            success = true;
                            wrapAccess.classList.add("off");
                            loading.classList.add("off");
                            finish.classList.remove("off");
                        } else {
                            alert("세션이 연결되지 않았습니다.");
                            loading.classList.add("off");
                        }
                        // document.body.innerHTML = res;
                    });
            }
        } else {
            if (check.length >= 4) {
                alert("4자리를 초과할 수 없습니다.");
            } else {
                valuespace.innerHTML = check + value;
            }
        }

        /* value space 가 공백일 경우에  */

        if (check.length >= 0) {
            valueplaceholder.style.display = "none";
        } else {
            valueplaceholder.style.display = "initial";
        }
    });
}

/** 성공 시 체크할 것 */
setInterval(() => {
    if (finish.classList.item(1) == null) {
        if (!success) {
            wrapAccess.classList.remove("off");
            loading.classList.add("off");
            finish.classList.add("off");
        }
    }
}, 1000);
