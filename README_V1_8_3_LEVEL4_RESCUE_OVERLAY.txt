# Мисија на Александар v1.8.3 — Level 4 Rescue Overlay

Ова е најсилна поправка за проблемот „Ниво 4 е темница“.

## Што прави

- Додава видлив overlay врз самиот `#game-container`, независно од Phaser depth.
- Overlay се појавува само на Ниво 4.
- Додава:
  - светла позадина
  - наслов „Ниво 4 · Небесни Знаци“
  - ѕвезди
  - метеори
  - super-jump orb
  - антички столбови
  - светлосна линија
- Ако Phaser слоевите пак не се гледаат, overlay-от мора да се гледа затоа што е DOM над canvas.

## Upload

Качи ги сите фајлови во GitHub.

Commit summary:
Add v1.8.3 level 4 rescue overlay

## Test URL

https://aleksandarmakedonskigame.github.io/aleksandar-makedonski-game/?v=1.8.3

## Тест

1. Отвори со `?v=1.8.3`.
2. Провери во мени дали има `v1.8.3 активна`.
3. Оди на ниво 4.
4. Треба да се појави overlay со светлина, ѕвезди, метеори и orb.
