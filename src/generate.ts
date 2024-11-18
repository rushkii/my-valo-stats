import { createCanvas } from 'canvas';
import { loadImages } from './lib/canvas/loadImages';
import { makeCanvasRounded } from './lib/canvas/makeRounded';
import samples from './data/samples.json';
import { save } from './lib/canvas/save';
import { loadFonts } from './lib/canvas/loadFonts';
import { getRrankImage } from './lib/rankImage';

//

const canvas = createCanvas(576, 500);
const ctx = canvas.getContext('2d');
const { valAgent, valHistory, valMatches } = samples.valorant;

//

export const generateProfileCard = async () => {
  // load all fonts
  await loadFonts();

  const top3Agents = valHistory.topAgents.map((e) => e).slice(0, 3);

  // load all specific image from URLs using Promise.all()
  const [avatar, background, rank] = await loadImages([
    valAgent.playerProfile,
    valAgent.playerBackground,
    getRrankImage(valAgent.rank.rankName)
  ]);

  // load rank images from URLs using Promise.all()
  // const [] = await loadImages([])

  // make the canvas background
  makeCanvasRounded(ctx, canvas.width, canvas.height);

  // background color for the main canvas background
  ctx.fillStyle = '#181414';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // player background image
  ctx.drawImage(background, 0, 0, canvas.width, background.height);

  // linear gradient color for the player background cover
  const gradientBg = ctx.createLinearGradient(0, background.height, 0, 0);
  gradientBg.addColorStop(0.2, 'rgba(0, 0, 0, 0.9)');
  gradientBg.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = gradientBg;
  ctx.fillRect(0, 0, canvas.width, background.height);

  // make player avatar full rounded
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, background.height / 2 - 15, 40, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(
    avatar,
    canvas.width / 2 - avatar.width / 2 + 24,
    background.height / 2 - avatar.height / 2 + 10,
    80,
    80
  );
  ctx.restore();

  // write player game name and tag line
  ctx.fillStyle = '#C89B3C';
  ctx.textAlign = 'center';
  ctx.font = '25px "Beaufort-Bold"';
  const gameName = valAgent.gameName;
  const tagLine = '#' + valAgent.tagLine;
  const gameNameMeasure = ctx.measureText(gameName);
  const tagLineMeasure = ctx.measureText(tagLine);
  ctx.fillText(
    gameName,
    canvas.width / 2 - tagLineMeasure.actualBoundingBoxLeft,
    background.height - 10
  );
  ctx.fillStyle = 'rgba(200, 155, 60, 0.5)';
  ctx.fillText(
    tagLine,
    canvas.width / 2 + gameNameMeasure.actualBoundingBoxRight,
    background.height - 10
  );

  // main content
  const marginX = 30;
  const marginY = 30;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'start';
  ctx.font = '13px "Beaufort-Medium"';
  ctx.fillText('Rank', marginX, background.height + marginY);

  // player rank name
  ctx.fillStyle = '#fff';
  ctx.font = '20px "Beaufort-Medium"';
  ctx.fillText(valAgent.rank.rankName, marginX, 25 + background.height + marginY);

  // player rank image
  const rankIconSize = 50;
  ctx.drawImage(
    rank,
    canvas.width - rankIconSize - marginX,
    background.height - 15 + marginY,
    rankIconSize,
    rankIconSize
  );

  // separator line
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.moveTo(canvas.width - marginX, 50 + background.height + marginY);
  ctx.lineTo(marginX, 50 + background.height + marginY);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'start';
  ctx.font = '13px "Beaufort-Medium"';
  ctx.fillText('K/D Ratio Per Agent', marginX, 80 + background.height + marginY);

  let spaceBetweenAgent = 0;
  const topAgentIconSize = 80;
  const marginYTopAgent = 20;

  // render top 3 agents
  for (const agent of top3Agents) {
    const [agentIcon] = await loadImages([agent.characterURL]);

    // make agent avatar full rounded
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.arc(
      38 + marginX + spaceBetweenAgent,
      115 + marginYTopAgent + background.height + marginY,
      40,
      0,
      Math.PI * 2,
      false
    );
    ctx.clip();
    ctx.fillRect(
      marginX + spaceBetweenAgent - 5,
      73 + marginYTopAgent + background.height + marginY,
      85,
      85
    );
    ctx.drawImage(
      agentIcon,
      marginX + spaceBetweenAgent,
      75 + marginYTopAgent + background.height + marginY,
      topAgentIconSize,
      topAgentIconSize
    );
    ctx.restore();

    spaceBetweenAgent += canvas.width / 2 - topAgentIconSize + 13;
  }

  // save it!
  save(canvas);
};
