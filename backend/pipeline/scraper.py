import requests
from bs4 import BeautifulSoup
URL = "https://catalog.uic.edu/ucat/colleges-depts/engineering/cs/bs-data-science-computer-science/"
page = requests.get(URL)

print(page.text)
soup = BeautifulSoup(page.content, "html.parser")

#testing our soup
print(soup.title.text)
print(soup.find("h1").text)
tables = soup.find_all("table")
print(len(tables))