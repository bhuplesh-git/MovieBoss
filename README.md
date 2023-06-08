# MovieBoss

This is a fun app to explore GPT capabilities. The point of this project is to explore GPT, not javascript.
You can customize javascript as per your choice.

Writing a good prompt is the key. This comes with lot of experimentations. The prompt need to be as descriptive as possible with examples. 

This app uses APIs to interact with openai. I have used python openai module. You can embedd it directly into the javascript as well. 

The code for python API is simple and can be deployed with a flask app. Here is sample code.

+++++++++++++++++++++++++++++++++++++++++++++++++
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import openai

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


openai.api_key = 'your openai API key'

@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'ok, all good'})


@app.route('/getTextFromPrompt', methods=['POST'])
@cross_origin()
def generateText():
    data = request.get_json()
    prompt = data['prompt']
    max_tokens = data['max_tokens']
    temperature = data['temperature']

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens = max_tokens,
        temperature = temperature
    )
    print(response)
    return response


@app.route('/getImageFromPrompt', methods=['POST'])
@cross_origin()
def generateImage():
    data = request.get_json()
    prompt = data['prompt']
    response = openai.Image.create(
        prompt=prompt,
        n = 1,
        size="256x256",
        response_format="b64_json"
    )
    return response
+++++++++++++++++++++++++++++++++++++++++++++++++



    
