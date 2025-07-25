import os
import io
import nekos
import requests
from datetime import datetime, timedelta


def create_readme():
    """
    Creates the Readme.md from the Readme template.
    """

    age = get_age('2003-12-29')
    try:
        fact = nekos.fact()
    except Exception as e:
        try:
            fact = requests.get("https://uselessfacts.jsph.pl/random.json?language=en").json()["text"]
        except Exception as e:
            fact = "ERROR API Offline XD."
    last_updated_at = get_last_updated()

    readme = io.open('README.md', 'w+', encoding='UTF-8')
    for line in io.open('readme.template.md', 'r', encoding='UTF-8'):
        line = line.replace('{{age}}', age)
        line = line.replace('{{fact}}', fact)
        line = line.replace('{{last_updated}}', last_updated_at)
        readme.write(line)

    readme.close()


def get_age(dob):
    """
    Returns the age of the entity.
    """

    now = datetime.now()
    dob = datetime.strptime(dob, '%Y-%m-%d')
    age = (now - dob)
    print(now,"aaaaa",dob,"aaaaa",age)
    
    current_hour = now.hour
    value = 10
    result = current_hour - value
    if result < 0:
        age -= timedelta(days=1)
        
    return str(age.days)


def get_last_updated():
    """
    Returns the last updated date.
    """

    now = datetime.now()
    return datetime.strftime(now, '%d %b, %Y')


def main():
    """
    Main function for the Module.
    """

    create_readme()


#os.remove("README.md")
main()
