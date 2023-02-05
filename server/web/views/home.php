<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        body {
            font-family: sans-serif;
            background-image: url("https://i.imgur.com/9cfNnnE.jpg");
        }

        .centered {
            margin: 22px auto;
            width: min-content;
        }

        .grid {
            width: 280px;
            height: 280px;
            display: grid;
            grid-template-columns: repeat(<?= GRID_SIZE ?>, 1fr);
            gap: 8px;
        }

        .letter {
            padding: 12px;
            border: 2px solid gray;
            border-radius: 4px;
            display: grid;
            place-items: center;
            background-color: white;
        }

        .letter.found {
            animation: unveil .3s;
        }

        @keyframes unveil {
            0% {
                transform: scale(1);
            }

            10% {
                transform: scale(0.7);
            }

            100% {
                transform: scale(1);
            }
        }

        .letter img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        label {
            display: flex;
            flex-direction: column;
        }

        input[name=word] {
            text-transform: uppercase;
        }

        input.error {
            animation: inputError .3s;
        }

        @keyframes inputError {
            0% {
                border-color: red;
                transform: translateX(0%);
            }

            10% {
                transform: translateX(-10%);
            }

            20% {
                transform: translateX(0%);
            }

            30% {
                transform: translateX(-8%);
            }

            50% {
                transform: translateX(0%);
            }

            80% {
                transform: translateX(-6%);
            }

            100% {
                transform: translateX(0%);
            }
        }

        form[aria-busy=true] {
            opacity: 0.7;
            pointer-events: none;
        }
    </style>
</head>

<body>

    <div class="centered">
        <div class="grid">
            <?php foreach ($grid as $i => $letter) : ?>
                <div class="letter _<?= $i ?>">
                    <img src="<?= $antiCheat->generateImageFor($letter) ?>" alt="Lettre masquée">
                </div>
            <?php endforeach; ?>
        </div>

        <form class="getWordPath" aria-busy="true">
            <br>
            <label>
                <span>Inscrire un mot de la grille</span>
                <input required name="word" type="text">
            </label>
            <button>Vérifier</button>
        </form>

        <p class="result"><?= $displayResult ?></p>
    </div>

    <script>
        const form = document.querySelector(".getWordPath");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            form.attributes["aria-busy"].value = true;
            const word = form.word.value;

            const response = await fetch(`?word=${word}&action=verifyWordAndGetPath`);
            const data = await response.json();

            if (data.success && data.isWordFound) {
                form.word.value = "";

                const path = data.path.split(" ");

                path.forEach((letterPos, i) => {
                    setTimeout(() => {
                        const letter = document.querySelector(`.letter._${letterPos}`);
                        letter.classList.add("found");
                        setTimeout(() => {
                            letter.classList.remove("found");
                        }, 300);
                    }, 150 * i);
                });
            } else {
                form.word.classList.add("error");
                setTimeout(() => {
                    form.word.classList.remove("error");
                }, 300);
            }

            form.attributes["aria-busy"].value = false;
        });

        form.attributes["aria-busy"].value = false;
    </script>

</body>

</html>