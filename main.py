import io
import nekos
from datetime import datetime


def create_readme():
    """
    Creates the Readme.md from the Readme template.
    """

    age = get_age('2003-12-29')
    fact = nekos.fact()
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
    age = (now - dob).days
    return str(age)


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


if __name__ == '__main__':
    main()
