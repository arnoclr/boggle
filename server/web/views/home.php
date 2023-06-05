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
    </style>
</head>

<body>

    <div class="centered">
        <div class="grid">
            <?php foreach ($grid as $letter) : ?>
                <div class="letter">
                    <img src="<?= $antiCheat->generateImageFor($letter) ?>" alt="Lettre masquée">
                </div>
            <?php endforeach; ?>
        </div>

        <form>
            <br>
            <label>
                <span>Tester un mot dans le dictionnaire</span>
                <input name="word" type="text">
            </label>
            <button>Vérifier</button>
        </form>

        <p class="result"><?= $displayResult ?></p>
    </div>

</body>

</html>