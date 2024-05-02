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


def main():
    s = cloudscraper.create_scraper()
    tracker_url = f"https://api.tracker.gg/api/v2/valorant/standard/matches/riot/{GAMERTAG}?type=unrated&agent=all&map=all"
    tz = pytz.timezone("Asia/Jakarta")

    res = s.get(tracker_url)
    data = res.json()
    unrated_matches = data["data"]["matches"]

    engine = jinja2.Template(pathlib.Path("template.html").read_text())
    rendered = engine.render(
        unrated_matches=unrated_matches,
        ago=timeago.format,
        date=dateparser.parse,
        tz=tz,
        now=datetime.now(tz=tz)
    )

    p = pathlib.Path("README.md")
    p.write_text(rendered + "\n")

    shutil.rmtree("matches", ignore_errors=True)

    for unrated in unrated_matches:
        if not os.path.exists("matches"):
            os.makedirs("matches")
        with open(f"matches/{unrated['attributes']['id']}.md", "w") as f:
            f.write(f"{unrated['attributes']['id']}" + "\n")


if __name__ == "__main__":
    main()
