import {
  Entity,
  MaterialComponent,
  PositionComponent,
  SizeComponent,
  BasicEntity,
  TextAreaComponent,
  Color,
  COLOR_WHITE,
} from '@mantou/ecs';
import { NewPieceComponent, PieceComponent } from 'src/components';

import { BORDER_COLOR, HEIGHT, STAGE_BACKGROUND_COLOR, WIDTH, SCORE_COLOR, WorldDta } from 'src/constants';

const colors = [
  new Color(88, 114, 255),
  new Color(183, 66, 255),
  new Color(240, 0, 161),
  new Color(255, 0, 0),
  new Color(188, 108, 0),
  new Color(147, 126, 0),
  new Color(68, 144, 0),
  new Color(0, 145, 110),
  new Color(0, 141, 155),
  new Color(0, 134, 198),
];

export class PieceEntity extends Entity {
  constructor(
    data: WorldDta,
    { type, label, is2Player = false }: { type?: number[][]; label?: string | number; is2Player?: boolean } = {},
  ) {
    super(label);
    const pieceComponent = new PieceComponent(type);

    this.addComponent(new NewPieceComponent()).addComponent(pieceComponent).addComponent(new PositionComponent());

    const len = Math.floor(colors.length / 2);
    const color = colors[(is2Player ? len : 0) + Math.floor(Math.random() * len)];

    pieceComponent.type.forEach((c, y) => {
      c.forEach((point, x) => {
        if (point) {
          this.addEntity(
            new BasicEntity()
              .addComponent(new PositionComponent(data.brickSize * x, data.brickSize * y))
              .addComponent(new SizeComponent(data.brickSize - 1, data.brickSize - 1))
              .addComponent(new MaterialComponent(color)),
          );
        }
      });
    });
  }

  transformX(data: WorldDta, offsetDir: 0 | -1 | 1 = 0) {
    const offset = offsetDir * Math.round(data.gridWidth / 6);
    const pieceComponent = this.getComponent(PieceComponent)!;
    const positionComponent = this.getComponent(PositionComponent)!;
    pieceComponent.gridX = Math.round(data.gridWidth / 2 - pieceComponent.cols / 2) + offset;
    positionComponent.x = pieceComponent.gridX * data.brickSize;
    return this;
  }

  removeBrickFromLine(data: WorldDta, lineNum: number) {
    const pieceComponent = this.getComponent(PieceComponent)!;
    const positionComponent = this.getComponent(PositionComponent)!;
    if (pieceComponent.gridY > lineNum) return;

    if (pieceComponent.gridY + pieceComponent.rows <= lineNum) {
      pieceComponent.gridY++;
      positionComponent.y += data.brickSize;
    } else {
      this.getEntities().forEach((entity) => {
        const position = entity.getComponent(PositionComponent)!;
        const y = (lineNum - pieceComponent.gridY) * data.brickSize;
        if (position.y === y) {
          entity.remove();
        } else if (position.y < y) {
          position.y += data.brickSize;
        }
      });
    }
  }

  transform(data: WorldDta) {
    const pieceComponent = this.getComponent(PieceComponent)!;
    const positionComponent = this.getComponent(PositionComponent)!;
    const entities = this.getEntities();

    pieceComponent.transform(data.grid);

    positionComponent.x = pieceComponent.gridX * data.brickSize;
    positionComponent.y = pieceComponent.gridY * data.brickSize;

    pieceComponent.type.forEach((line, y) => {
      line.forEach((v, x) => {
        if (v) {
          entities
            .pop()!
            .removeComponent(PositionComponent)
            .addComponent(new PositionComponent(data.brickSize * x, data.brickSize * y));
        }
      });
    });
    return this;
  }

  update(data: WorldDta) {
    const pieceComponent = this.getComponent(PieceComponent)!;
    const positionComponent = this.getComponent(PositionComponent)!;

    const originPieceGridX = pieceComponent.gridX;
    const originPieceGridY = pieceComponent.gridY;

    positionComponent.update();
    pieceComponent.gridX = positionComponent.x / data.brickSize;
    pieceComponent.gridY = positionComponent.y / data.brickSize;
    return () => {
      positionComponent.restore();
      pieceComponent.gridX = originPieceGridX;
      pieceComponent.gridY = originPieceGridY;
    };
  }
}

export class FailedEntity extends Entity {
  constructor(score: string) {
    super();
    this.addComponent(new PositionComponent(WIDTH / 4, HEIGHT / 4))
      .addComponent(new SizeComponent(WIDTH / 2, HEIGHT / 2))
      .addComponent(new MaterialComponent(BORDER_COLOR))
      .addEntity(
        new BasicEntity()
          .addComponent(new PositionComponent(2, 2))
          .addComponent(new SizeComponent(WIDTH / 2 - 4, HEIGHT / 2 - 4))
          .addComponent(new MaterialComponent(STAGE_BACKGROUND_COLOR))
          .addEntity(
            new BasicEntity()
              .addComponent(new PositionComponent(0, 40))
              .addComponent(new MaterialComponent(COLOR_WHITE))
              .addComponent(
                new TextAreaComponent(`GAME OVER!`, { width: WIDTH / 2 - 4, fontType: 'heading', center: true }),
              ),
          )
          .addEntity(
            new BasicEntity()
              .addComponent(new PositionComponent(0, 60))
              .addComponent(new MaterialComponent(SCORE_COLOR))
              .addComponent(
                new TextAreaComponent(`SCORE: ${score}`, { width: WIDTH / 2 - 4, fontType: 'default', center: true }),
              ),
          ),
      );
  }
}
