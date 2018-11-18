from bs4 import BeautifulSoup
import selenium.webdriver as webdriver
import os
import requests

from threading import Timer

# 	   https://www.instagram.com/explore/tags/nuitdelaubette/
# 	   https://www.instagram.com/explore/tags/lanuitdelaubette/
# 	   https://www.instagram.com/explore/tags/machineaubette/



newpath = r'images/' 
if not os.path.exists(newpath):
    os.makedirs(newpath)




def instaScrap():
	url = 'https://www.instagram.com/explore/tags/lanuitdelaubette/'

	screenW = 1280
	screenH = 800

	driver = webdriver.Firefox()
	driver.set_window_size(screenW/2, screenH/2)
	driver.set_window_position(screenW/4, screenH/4)
	driver.get(url)

	soup = BeautifulSoup(driver.page_source,features="html.parser")


	print(" ___  ___ _ __ __ _ _ __  ")
	print("/ __|/ __| '__/ _` | '_ \ ")
	print("\__ \ (__| | | (_| | |_) |")
	print("|___/\___|_|  \__,_| .__/ ")
	print("                   | |    ")
	print("                   |_|    ")


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