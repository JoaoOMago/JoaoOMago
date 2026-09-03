import os
import io
import nekos
import requests
from datetime import datetime, timedelta
import random
from PIL import Image



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
    for line in io.open('docs/update-readme/readme.template.md', 'r', encoding='UTF-8'):
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


def sortear_e_copiar_foto(valor_maximo):
    """
    Sorteia uma foto para o perfil do site.
    Sempre salva o resultado em formato .jpeg,
    ignorando qualquer subpasta dentro da pasta de origem.
    """

    nome_destino = "fotoperfilsite"
    valor_minimo = 1
    pasta_origem = "docs/assets/imagens"
    pasta_destino = "docs/assets/imagens/imagem"

    # 1. Sorteia o número
    numero_sorteado = random.randint(valor_minimo, valor_maximo)
    print(f"Número sorteado: {numero_sorteado}")

    # 2. Procura na pasta de origem um ARQUIVO (ignora subpastas) que comece com esse número
    arquivo_encontrado = None
    for nome_arquivo in os.listdir(pasta_origem):
        caminho_completo = os.path.join(pasta_origem, nome_arquivo)

        # ignora qualquer pasta (inclusive a pasta destino, se estiver dentro da origem)
        if not os.path.isfile(caminho_completo):
            continue

        nome_sem_extensao, extensao = os.path.splitext(nome_arquivo)
        if nome_sem_extensao == str(numero_sorteado):
            arquivo_encontrado = nome_arquivo
            break

    if arquivo_encontrado is None:
        raise FileNotFoundError(
            f"Nenhuma foto com o nome '{numero_sorteado}' foi encontrada em '{pasta_origem}'."
        )

    caminho_origem = os.path.join(pasta_origem, arquivo_encontrado)

    # 3. Garante que a pasta de destino existe
    os.makedirs(pasta_destino, exist_ok=True)

    # 4. Monta o caminho final sempre com extensão .jpeg
    nome_destino_final = nome_destino + ".jpeg"
    caminho_destino = os.path.join(pasta_destino, nome_destino_final)

    # 5. Abre a imagem original e salva como .jpeg, sobrescrevendo se já existir
    imagem = Image.open(caminho_origem)
    imagem = imagem.convert("RGB")  # necessário pois JPEG não suporta transparência (PNG/RGBA)
    imagem.save(caminho_destino, "JPEG")


def main():
    """
    Main function for the Module.
    """

    create_readme()
    sortear_e_copiar_foto(5)


#os.remove("README.md")
main()
