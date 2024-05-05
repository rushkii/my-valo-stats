import os
import shutil
import jinja2
import cloudscraper
import timeago
import pathlib
import dateparser
import pytz
from typing import Union, Literal
from datetime import datetime
from urllib.parse import quote
from dotenv import load_dotenv


load_dotenv()
# Your Valorant's nickname/gamertag e.g: kizu#movq
GAMERTAG = quote(os.environ.get("GAMERTAG", ""))
s = cloudscraper.create_scraper()

def get_rating(value: int):
    if value == int(1e3):
        return "1k"
    elif value >= 825:
        return "s"
    elif value >= 650:
        return "a"
    elif value >= 475:
        return "b"
    elif value >= 300:
        return "c"
    else:
        return "d"

def get_rating_img(value: int):
    return f"https://trackercdn.com/cdn/tracker.gg/img/tracker-score/trn-rating-{get_rating(value)}.svg"

def get_match_overview():
    url = f"https://api.tracker.gg/api/v2/valorant/standard/matches/riot/{GAMERTAG}"
    unrated_res = s.get(url + "?type=unrated&agent=all&map=all")
    compe_res = s.get(url + "?type=competitive&agent=all&map=all")
    return unrated_res.json()["data"]["matches"], compe_res.json()["data"]["matches"]

def get_match_details(match_id: str):
    res = s.get("https://api.tracker.gg/api/v2/valorant/standard/matches/" + match_id)
    return res.json()["data"]

def get_summary_team(team_id: str, segments: dict):
    t = [i for i in segments if i['type'] == "player-summary"]
    if team_id != "ffa":
        t = [i for i in t if i['metadata']['teamId'] == team_id]
    t.sort(key=lambda i: i['stats']['scorePerRound']['value'], reverse=True)
    return t

def render_readme(
    match_data: dict,
    queue_type: Union[Literal['unrated'], Literal['competitive']]
):
    match = get_match_details(match_data['attributes']['id'])
    segments = match['segments']

    template = pathlib.Path("template-details.html").read_text()
    engine = jinja2.Template(template)
    rendered = engine.render(
        team_a=get_summary_team('Red', segments),
        team_b=get_summary_team('Blue', segments),
        competitive=queue_type == 'competitive',
        get_rating_img=get_rating_img,
        ago=timeago.format,
        date=dateparser.parse,
    )
    rendered = rendered.replace('\r\n', '\n')
    path = pathlib.Path(f"matches/{queue_type}/{match_data['attributes']['id']}.md")
    path.write_text(rendered + "\n", encoding="utf-8")


def main():
    tz = pytz.timezone("Asia/Jakarta")
    unrated_matches, compe_matches = get_match_overview()

    engine = jinja2.Template(pathlib.Path("template-overview.html").read_text())
    rendered = engine.render(
        unrated_matches=unrated_matches,
        compe_matches=compe_matches,
        get_rating_img=get_rating_img,
        ago=timeago.format,
        date=dateparser.parse,
        tz=tz,
        now=datetime.now(tz=tz)
    )
    rendered = rendered.replace('\r\n', '\n')

    p = pathlib.Path("README.md")
    p.write_text(rendered + "\n")

    shutil.rmtree("matches", ignore_errors=True)
    if not os.path.exists("matches/unrated"):
        os.makedirs("matches/unrated")
    if not os.path.exists("matches/competitive"):
        os.makedirs("matches/competitive")

    for unrated in unrated_matches:
        if not unrated: continue
        render_readme(unrated, 'unrated')

    for competitive in compe_matches:
        if not competitive: continue
        render_readme(competitive, 'competitive')


if __name__ == "__main__":
    main()
