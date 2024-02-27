document.getElementById("pick-number").addEventListener("click", function () {
    fetch("numbers.json")
        .then((response) => response.json())
        .then((data) => {
            const numbers = data.numbers;
            let counter = 0;
            let intervalDuration = 50; // Bắt đầu với 50ms cho mỗi lần cập nhật số
            const duration = 8000; // Tổng thời gian quay số là 8 giây
            let lastRandomIndex = 0; // Lưu trữ chỉ số ngẫu nhiên cuối cùng được sử dụng

            document.getElementById("startSound").play();

            const randomNumberElement =
                document.getElementById("random-number");
            randomNumberElement.classList.remove("zoom-in-out");

            const updateNumber = () => {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                lastRandomIndex = randomIndex; // Cập nhật chỉ số ngẫu nhiên cuối cùng
                randomNumberElement.textContent = numbers[randomIndex];
                randomNumberElement.classList.add("flicker");
            };

            randomNumberElement.addEventListener("animationend", () => {
                randomNumberElement.classList.remove("flicker");
            });

            const intervalId = setInterval(() => {
                updateNumber();

                counter += intervalDuration;
                if (counter >= duration) {
                    clearInterval(intervalId);
                    document.getElementById("endSound").play();
                    randomNumberElement.classList.add("zoom-in-out");
                    sendNumberToServer(numbers[lastRandomIndex]); // Sử dụng lastRandomIndex ở đây

                    // Tạo pháo giấy khi hết thời gian
                    createConfetti();
                    createStreamerConfetti();
                }
            }, intervalDuration);
        })
        .catch((error) => console.error("Error loading the JSON file:", error));
});

function sendNumberToServer(number) {
    fetch("/pick-number", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: number }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((data) => console.log("Number sent successfully:", data))
        .catch((error) => console.error("Error:", error));
}

function createConfetti() {
    const confettiContainer = document.getElementById("confetti-container");
    confettiContainer.innerHTML = ""; // Xóa pháo giấy cũ trước khi tạo mới
    for (let i = 0; i < 200; i++) {
        // Tăng số lượng từ 100 lên 200
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        const bgColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.setProperty("--confetti-color", bgColor);

        const translateX = `${Math.random() * 2000 - 1000}px`;
        const translateY = `${Math.random() * 2000 - 1000}px`;
        confetti.style.setProperty("--translateX", translateX);
        confetti.style.setProperty("--translateY", translateY);

        confetti.style.animation = `confetti-burst ${
            Math.random() * 2 + 1
        }s linear forwards`;
        confettiContainer.appendChild(confetti);
    }
}
function createStreamerConfetti() {
    const confettiContainer = document.getElementById("confetti-container");
    for (let i = 0; i < 300; i++) {
        // Tạo 100 dải pháo giấy
        const streamer = document.createElement("div");
        streamer.classList.add("confetti-streamer");
        const bgColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        streamer.style.setProperty("--confetti-color", bgColor);

        // Tạo vị trí ngẫu nhiên trên màn hình
        streamer.style.left = `${Math.random() * 100}%`;
        streamer.style.top = `${Math.random() * 100}%`;

        // Áp dụng animation
        streamer.style.animation = `streamer-burst ${
            Math.random() * 2 + 1
        }s ease-out forwards`;

        confettiContainer.appendChild(streamer);
    }
}
