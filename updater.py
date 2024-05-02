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

def main():
    s = cloudscraper.create_scraper()
    tracker_url = f"https://api.tracker.gg/api/v2/valorant/standard/matches/riot/{GAMERTAG}"
    tz = pytz.timezone("Asia/Jakarta")

    unrated_res = s.get(tracker_url + "?type=unrated&agent=all&map=all")
    compe_res = s.get(tracker_url + "?type=competitive&agent=all&map=all")
    unrated_data = unrated_res.json()
    compe_data = compe_res.json()
    unrated_matches = unrated_data["data"]["matches"]
    compe_matches = compe_data["data"]["matches"]

    engine = jinja2.Template(pathlib.Path("template.html").read_text())
    rendered = engine.render(
        unrated_matches=unrated_matches,
        compe_matches=compe_matches,
        get_rating_img=get_rating_img,
        ago=timeago.format,
        date=dateparser.parse,
        tz=tz,
        now=datetime.now(tz=tz)
    )

    p = pathlib.Path("README.md")
    p.write_text(rendered + "\n")

    shutil.rmtree("matches", ignore_errors=True)

    for unrated in unrated_matches:
        if not os.path.exists("matches/unrated"):
            os.makedirs("matches/unrated")
        with open(f"matches/unrated/{unrated['attributes']['id']}.md", "w") as f:
            f.write(f"{unrated['attributes']['id']}" + "\n")

    for compe in compe_matches:
        if not os.path.exists("matches/compe"):
            os.makedirs("matches/compe")
        with open(f"matches/compe/{compe['attributes']['id']}.md", "w") as f:
            f.write(f"{compe['attributes']['id']}" + "\n")


if __name__ == "__main__":
    main()
