import os
import shutil
import jinja2
import cloudscraper
import timeago
import pathlib
import dateparser
import pytz
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

    for unrated in unrated_matches:
        if not os.path.exists("matches/unrated"):
            os.makedirs("matches/unrated")

        unrated_details = get_match_details(unrated['attributes']['id'])
        unrated_engine = jinja2.Template(pathlib.Path("template-details.html").read_text())
        unrated_rendered = unrated_engine.render(
            unrated_details=unrated_details,
            get_rating_img=get_rating_img,
            ago=timeago.format,
            date=dateparser.parse,
            tz=tz,
            now=datetime.now(tz=tz)
        )
        unrated_rendered = unrated_rendered.replace('\r\n', '\n')

        unrated_path = pathlib.Path(f"matches/unrated/{unrated['attributes']['id']}.md")
        unrated_path.write_text(unrated_rendered + "\n")

    for compe in compe_matches:
        if not os.path.exists("matches/compe"):
            os.makedirs("matches/compe")
        with open(f"matches/compe/{compe['attributes']['id']}.md", "w") as f:
            f.write(f"{compe['attributes']['id']}" + "\n")


if __name__ == "__main__":
    main()
