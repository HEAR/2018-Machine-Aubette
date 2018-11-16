from bs4 import BeautifulSoup
import selenium.webdriver as webdriver
import os
import requests

from threading import Timer

# 	   https://www.instagram.com/explore/tags/nuitdelaubette/
# 	   https://www.instagram.com/explore/tags/lanuitdelaubette/
# 	   https://www.instagram.com/explore/tags/machineaubette/





def instaScrap():
	url = 'https://www.instagram.com/explore/tags/test/'
	driver = webdriver.Firefox()
	driver.get(url)

	soup = BeautifulSoup(driver.page_source,features="html.parser")


	num = 0

	for x in soup.findAll('img', {'class':'FFVAD'}):
		url = x['src']
		# print(url)

		image 	= requests.get(url)
		f_ext 	= os.path.splitext(url)[-1]
		f_name 	= os.path.basename(url)

		print(str(num) + " -> " + f_name)

		num += 1

		with open('images/'+f_name, 'wb') as f:
			f.write(image.content)

	driver.close()

	Timer(30.0, instaScrap).start()

Timer(0.0, instaScrap).start()