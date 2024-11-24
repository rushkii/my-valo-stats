import { createCanvas } from 'canvas';
import { loadImages } from './lib/canvas/loadImages';
import { makeAvatarRounded, makeCanvasRounded } from './lib/canvas/makeRounded';
import samples from './data/samples.json';
import { save } from './lib/canvas/save';
import { loadFonts } from './lib/canvas/loadFonts';
import { getRrankImage, isMvp, loadElementFromString, toHumanTime } from './lib/utils';
import { writeTextUnderline } from './lib/canvas/textUnderline';
import { ExtractedElement, MatchType } from './lib/types';
import { writeTextWithRounded } from './lib/canvas/writeTextWithRounded';

//

const { valAgent, valHistory, valMatches } = samples.valorant;

//

export const generateProfileCard = async () => {
  const canvas = createCanvas(576, 500);
  const ctx = canvas.getContext('2d');

  // load all fonts
  await loadFonts();

  const top3Agents = valHistory.topAgents.map((e) => e).slice(0, 3);

  // load all specific image from URLs using Promise.all()
  const [avatar, background, rank] = await loadImages([
    valAgent.playerProfile,
    valAgent.playerBackground,
    getRrankImage(valAgent.rank.rankName)
  ]);

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
  makeAvatarRounded(ctx, { x: canvas.width / 2, y: background.height / 2 - 15, radius: 40 });
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
  ctx.font = '13px "Beaufort-Medium"';
  ctx.fillText('K/D Ratio Per Agent', marginX, 80 + background.height + marginY);

  let spaceBetweenAgent = 0;
  const topAgentIconSize = 80;
  const marginYTopAgent = 20;

  // render top 3 agents
  for (const agent of top3Agents) {
    const [agentIcon] = await loadImages([agent.characterURL]);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';

    // make agent avatar full rounded
    makeAvatarRounded(ctx, {
      x: 38 + marginX + spaceBetweenAgent,
      y: 115 + marginYTopAgent + background.height + marginY,
      radius: 40
    });
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

    // K/D Ratio
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '20px "Beaufort-Heavy"';
    ctx.fillText(
      agent.kdRatio.toFixed(2),
      38 + marginX + spaceBetweenAgent,
      180 + marginYTopAgent + background.height + marginY
    );

    // K/D Top Percent
    ctx.font = '10px "Beaufort-Bold"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const labelPercent = 'Top ';
    const valuePercent = agent.kdPercentage.toFixed(0) + '%';
    const labelMeasure = ctx.measureText(labelPercent);
    const percentMeasure = ctx.measureText(valuePercent);
    ctx.fillText(
      labelPercent,
      40 + marginX - percentMeasure.actualBoundingBoxLeft + spaceBetweenAgent,
      195 + marginYTopAgent + background.height + marginY
    );
    ctx.fillStyle = '#fff';
    ctx.fillText(
      valuePercent,
      40 + marginX + labelMeasure.actualBoundingBoxRight + spaceBetweenAgent,
      195 + marginYTopAgent + background.height + marginY
    );

    spaceBetweenAgent += canvas.width / 2 - topAgentIconSize + 13;
  }

  // display watermark
  ctx.font = '20px "Beaufort-HeavyItalic"';
  ctx.fillStyle = '#fff';
  ctx.fillText('This image is generated using NodeJS Canvas', canvas.width / 2, canvas.height - 55);

  ctx.font = '15px "Beaufort-BoldItalic"';
  writeTextUnderline(ctx, {
    text: 'https://github.com/rushkii/my-valo-stats',
    x: canvas.width / 2,
    y: canvas.height - marginX,
    color: '#0ea5e9'
  });

  // save it!
  save(canvas, `output/profile.png`);
};

const render = async ({ key, match }: { key: number; match: MatchType }) => {
  const canvas = createCanvas(768, 150);
  const ctx = canvas.getContext('2d');

  const participants = match.participants;
  const myself = participants.find((e) => e.playerPUUID === valAgent.puuid)!;
  const matchResult = match.matchResult;
  const isVictory = matchResult === 'VICTORY';

  // background color for the main canvas background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw map background
  const bg = await loadImages([match.mapBackground]);
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.drawImage(bg[0], 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // draw line on the left
  const lineLeftWidth = 10;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = isVictory ? '#22c55e' : '#ef4444';
  ctx.lineWidth = lineLeftWidth;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.restore();

  // make background color with less opacity
  ctx.fillStyle = isVictory ? '#22c55e26' : '#ef444426';
  ctx.fillRect(lineLeftWidth - lineLeftWidth / 2, 0, canvas.width - 5, canvas.height);

  // make background color layer with darker
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(lineLeftWidth - lineLeftWidth / 2, 0, canvas.width - 5, canvas.height);

  const marginX = 40;
  const marginY = 30;

  // queue type e.g: unrated/compe/dm/tdm
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Beaufort-Heavy"';
  ctx.textAlign = 'center';
  ctx.fillText(match.queueTypeLoc, marginX * 2, marginY);

  // map name in capitalize case
  ctx.save();
  ctx.font = '15px "Beaufort-MediumItalic"';
  ctx.fillText(match.mapTitleLoc, marginX * 2, marginY + 20);
  ctx.restore();

  // match result rounded
  const padding = 10;
  writeTextWithRounded(ctx, {
    text: matchResult,
    x: marginX * 2,
    y: canvas.height / 2 + 10,
    textColor: '#fff',
    backgroundColor: isVictory ? '#22c55e' : '#ef4444',
    font: '15px "Beaufort-Bold"',
    align: 'center',
    baseline: 'middle',
    padding: padding,
    radius: 15
  });

  // game duration
  ctx.fillText(toHumanTime(match.gameLengthMillis), marginX * 2, marginY + 100);

  // separator
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff33';
  ctx.lineWidth = 3;
  ctx.moveTo(marginX * 2 + marginX * 2, 10);
  ctx.lineTo(marginX * 2 + marginX * 2, canvas.height - 10);
  ctx.stroke();
  ctx.restore();

  // agent image
  const agentScale = 80;
  const ag = await loadImages([
    match.participants.find((e) => e.playerPUUID === valAgent.puuid)!.agentIcon
  ]);
  ctx.drawImage(
    ag[0],
    marginX * 4 + 20,
    canvas.height / 2 - agentScale / 2,
    agentScale,
    agentScale
  );

  // write K/D/A
  ctx.font = '20px "Beaufort-Heavy"';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'middle';

  const [kill, death, assist] = myself.kda.split('/');
  const resultColor = isVictory ? '#22c55e' : '#ef4444';

  const kda = `<span color="white">
    <span>${kill}</span>
    <span color="#ffffff80">/</span>
    <span color="${resultColor}">${death}</span>
    <span color="#ffffff80">/</span>
    <span>${assist}</span>
  </span>`;

  const spanObj = loadElementFromString(kda);

  const spans = [
    ...spanObj.content.map((e) => {
      const span = e as ExtractedElement;

      return {
        text: span.content.join(),
        color: span.attributes.color ?? spanObj.attributes.color!
      };
    })
  ];

  const spaceKda = 2;
  let x = marginX * 4 + agentScale + 30;
  const y = canvas.height / 2 - (isMvp(valAgent.puuid, match.participants) ? 15 : 0);

  spans.forEach((span) => {
    const width = ctx.measureText(span.text).width;
    ctx.fillStyle = span.color;
    ctx.fillText(span.text, x, y);
    x += width + spaceKda;
  });

  // am I MVP?
  if (isMvp(valAgent.puuid, match.participants)) {
    writeTextWithRounded(ctx, {
      text: myself.flair!,
      x: marginX * 4 + agentScale + 30,
      y: canvas.height / 2 + 15,
      textColor: '#fde047',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      font: '10px "Beaufort-Bold"',
      align: 'start',
      baseline: 'middle',
      padding: padding,
      radius: 15
    });
  }

  const filename = `${+key + 1}_${myself.agentNameLoc}_${match.mapTitleLoc}_${match.matchId}`;
  save(canvas, `output/matches/${filename}.png`);
};

export const generateMatches = async () => {
  // render Promises
  const renders = valMatches.map((e, i) => {
    const options = { match: e, key: i };
    return render(options);
  });

  await Promise.all(renders);
};
