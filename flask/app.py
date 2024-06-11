from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.layers import Dense, Embedding, LSTM, Dropout, Bidirectional
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np

app = Flask(__name__)
CORS(app)

texts = [
    "Boil water.",
    "Cut vegetables.",
    "Mix ingredients.",
    "Bake at 350°F for 30 minutes.",
    "Grill steak for 10 minutes on each side.",
    "Saute onions and garlic in olive oil.",
    "Whisk eggs and milk together.",
    "Season chicken with salt, pepper, and paprika.",
    "Fry bacon until crispy.",
    "Simmer tomato sauce for 20 minutes.",
    "Roast potatoes with rosemary.",
    "Blend strawberries and bananas for a smoothie.",
    "Steam broccoli for 5 minutes.",
    "Preheat oven to 375°F.",
    "Cook pasta in boiling water.",
    "Slice onions thinly.",
    "Preheat grill to medium heat.",
    "Marinate chicken in teriyaki sauce.",
    "Dice tomatoes for salsa.",
    "Bake cookies at 350°F for 12 minutes.",
    "Grate cheese for pizza topping.",
    "Boil rice in salted water.",
    "Chop cilantro for garnish.",
    "Whip cream until stiff peaks form.",
    "Melt butter in a saucepan.",
    "Knead dough until smooth.",
    "Toast bread until golden brown.",
    "Peel and core apples.",
    "Crush garlic cloves.",
    "Microwave on high for 2 minutes.",
    "Poach eggs in simmering water.",
    "Caramelize sugar in a pan.",
    "Dice onions finely.",
    "Mince parsley and thyme.",
    "Rub pork with a spice mixture.",
    "Deep fry chicken wings.",
    "Drizzle olive oil over salad.",
    "Spread jam on toast.",
    "Chill dough in the refrigerator.",
    "Baste turkey with melted butter.",
    "Layer lasagna with cheese and sauce.",
    "Puree soup in a blender.",
    "Shred cabbage for coleslaw.",
    "Boil eggs for 7 minutes.",
    "Scramble eggs in a skillet.",
    "Coat fish with breadcrumbs.",
    "Grill vegetables on skewers.",
    "Mix flour and baking soda.",
    "Soak beans overnight.",
    "Broil salmon for 5 minutes.",
    "Sear lamb chops in a hot pan.",
    "Stir fry beef with vegetables.",
    "Braise short ribs in red wine.",
    "Coat chicken in marinade.",
    "Reduce sauce until thickened.",
    "Layer cake with frosting.",
    "Toast almonds in a dry pan.",
    "Spread butter on bread.",
    "Marinate steak in soy sauce.",
    "Chop garlic finely.",
    "Puree tomatoes in a food processor.",
    "Simmer soup for 45 minutes.",
    "Blend spices for curry powder.",
    "Cook quinoa in vegetable broth.",
    "Toss salad with vinaigrette.",
    "Grill shrimp on skewers.",
    "Saute mushrooms in butter.",
    "Crisp bacon in the oven.",
    "Dice bell peppers for salsa.",
    "Toast sesame seeds in a pan.",
    "Melt chocolate over a double boiler.",
    "Knead pizza dough until elastic.",
    "Carve turkey into slices.",
    "Crush peanuts for topping.",
    "Roast carrots with a honey glaze.",
    "Preheat oven to 425°F.",
    "Boil potatoes until tender.",
    "Slice avocado for salad.",
    "Poach fish in white wine.",
    "Blend soup until smooth.",
    "Marinate tofu in soy sauce.",
    "Chop basil for pesto.",
    "Simmer beans in broth.",
    "Whisk mayonnaise and mustard.",
    "Bake bread at 400°F.",
    "Fry donuts in hot oil.",
    "Roast chicken with lemon.",
    "Slice cucumbers for pickles.",
    "Blend pancake batter.",
    "Grill sausages until browned.",
    "Chill wine before serving.",
    "Saute spinach in garlic.",
    "Boil corn on the cob.",
    "Toast croutons in the oven.",
    "Mash potatoes with butter.",
    "Whip egg whites to stiff peaks.",
    "Drizzle dressing over salad.",
    "Sear tuna in a hot pan.",
    "Blend margarita mix.",
    "Bake muffins at 375°F.",
    "Grill chicken breasts.",
    "Stir soup occasionally.",
    "Dice celery for stuffing.",
    "Melt cheese on nachos.",
    "Knead bread dough.",
    "Toast walnuts in the oven.",
    "Poach pears in red wine.",
    "Slice tomatoes for salad.",
    "Simmer stew for hours.",
    "Grill asparagus with olive oil.",
    "Scramble tofu with vegetables.",
    "Marinate beef overnight.",
    "Boil lobster in salted water.",
    "Chill pie crust before baking.",
    "Blend butter and sugar.",
    "Saute zucchini in butter.",
    "Whisk eggs for an omelet.",
    "Bake pie at 375°F.",
    "Toast bread for sandwiches.",
    "Stir fry tofu with soy sauce.",
    "Chop onions for soup.",
    "Poach chicken in broth.",
    "Mix pancake batter.",
    "Grill burgers to desired doneness.",
    "Bake fish at 400°F.",
    "Whip cream for dessert.",
    "Fry potatoes until golden.",
    "Simmer sauce until thick.",
    "Layer trifle with fruit.",
    "Blend smoothie ingredients.",
    "Saute shrimp with garlic.",
    "Knead pasta dough.",
    "Toast pine nuts for pesto.",
    "Poach eggs for benedict.",
    "Slice pork thinly.",
    "Simmer chili for hours.",
    "Grill corn on the cob.",
    "Scramble eggs with cheese.",
    "Marinate pork chops.",
    "Boil pasta until al dente.",
    "Chill soup before serving.",
    "Blend sauce until smooth.",
    "Roast duck with oranges.",
    "Knead dough for bread.",
    "Saute onions for soup.",
    "Whisk custard ingredients.",
    "Bake cake at 350°F.",
    "Toast coconut flakes.",
    "Poach eggs for breakfast.",
    "Slice cucumbers thinly.",
    "Simmer broth for ramen.",
    "Grill chicken for tacos.",
    "Mix ingredients for marinade.",
    "Saute spinach for a side dish.",
    "Knead dough for pizza.",
    "Toast bread for croutons.",
    "Scramble eggs for breakfast.",
    "Blend ingredients for smoothie.",
    "Grill steak for dinner.",
    "Boil water for tea.",
    "Bake cookies at 375°F.",
    "Saute mushrooms for pasta.",
    "Knead dough for rolls.",
    "Poach salmon in broth.",
    "Simmer sauce for pasta.",
    "Chop herbs for garnish.",
    "Blend ingredients for dip.",
    "Grill shrimp for skewers.",
    "Whisk ingredients for dressing.",
    "Bake biscuits at 400°F.",
    "Toast pecans for salad.",
    "Slice apples for pie.",
    "Simmer lentils for soup.",
    "Mix ingredients for batter.",
    "Saute onions for quiche.",
    "Knead dough for pie crust.",
    "Blend ingredients for dressing.",
    "Grill chicken for salad.",
    "Boil potatoes for mashed potatoes.",
    "Bake pizza at 425°F.",
    "Saute vegetables for stir fry.",
    "Knead dough for cinnamon rolls.",
    "Poach chicken for salad.",
    "Simmer sauce for pizza.",
    "Chop garlic for sauce.",
    "Blend ingredients for cake.",
    "Grill vegetables for skewers.",
    "Whisk ingredients for sauce.",
    "Bake cake at 375°F.",
    "Toast nuts for dessert.",
    "Slice strawberries for dessert.",
    "Simmer soup for hours.",
    "Mix ingredients for cookies.",
    "Saute peppers for fajitas.",
    "Knead dough for breadsticks.",
    "Toast sesame seeds for salad.",
    "Poach eggs for salad.",
    "Chop onions for salsa.",
    "Blend ingredients for pancakes.",
    "Grill fish for tacos.",
    "Boil eggs for salad.",
    "Bake lasagna at 375°F.",
    "Saute garlic for sauce.",
    "Knead dough for pretzels.",
    "Toast bread for breakfast.",
    "Simmer beans for chili.",
    "Mix ingredients for muffins.",
    "Saute beef for tacos.",
    "Knead dough for bagels.",
    "Grill vegetables for a side dish.",
    "Boil eggs for deviled eggs.",
    "Bake brownies at 350°F.",
    "Toast almonds for granola.",
    "Simmer chicken for soup.",
    "Blend ingredients for milkshake.",
    "Saute onions for gravy.",
    "Knead dough for flatbread.",
    "Grill chicken for kabobs.",
    "Boil pasta for lasagna.",
    "Bake fish for dinner.",
    "Toast pine nuts for salad.",
    "Simmer sauce for lasagna.",
    "Chop vegetables for salad.",
    "Blend ingredients for soup.",
    "Grill burgers for barbecue.",
    "Whisk ingredients for marinade.",
    "Bake bread at 425°F.",
    "Saute spinach for quiche.",
    "Knead dough for dinner rolls.",
    "Poach fish for tacos.",
    "Simmer stew for hours.",
    "Chop herbs for pesto.",
    "Blend ingredients for marinade.",
    "Grill chicken for barbecue.",
    "Boil potatoes for potato salad.",
    "Bake cake at 400°F.",
    "Toast coconut for dessert.",
    "Simmer vegetables."
]

tokenizer = Tokenizer()
tokenizer.fit_on_texts(texts)
vocab_size = len(tokenizer.word_index) + 1

sequences = []
for line in texts:
    token_list = tokenizer.texts_to_sequences([line])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i+1]
        sequences.append(n_gram_sequence)

max_sequence_len = max([len(x) for x in sequences])
sequences = pad_sequences(sequences, maxlen=max_sequence_len, padding='pre')

input_sequences = sequences[:, :-1]
output_sequences = sequences[:, -1]
output_sequences = tf.keras.utils.to_categorical(output_sequences, num_classes=vocab_size)

embedding_dim = 100
model = tf.keras.Sequential([
    Embedding(input_dim=vocab_size, output_dim=embedding_dim),
    Bidirectional(LSTM(150, return_sequences=True)),
    Dropout(0.2),
    LSTM(100),
    Dropout(0.2),
    Dense(vocab_size, activation='softmax')
])

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(input_sequences, output_sequences, epochs=200, verbose=2)

def top_p_sampling(predictions, p=0.9):
    sorted_indices = np.argsort(predictions)[::-1]
    sorted_probs = np.sort(predictions)[::-1]
    cumulative_probs = np.cumsum(sorted_probs)
    cutoff = np.argmax(cumulative_probs > p) + 1
    top_indices = sorted_indices[:cutoff]
    top_probs = sorted_probs[:cutoff]
    top_probs = top_probs / np.sum(top_probs)
    return np.random.choice(top_indices, p=top_probs)

def generate_text(seed_text, next_words, p=0.9, temperature=1.0):
    result = seed_text
    generated_words = seed_text.split()
    for _ in range(next_words):
        token_list = tokenizer.texts_to_sequences([result])[0]
        token_list = pad_sequences([token_list], maxlen=max_sequence_len - 1, padding='pre')
        predicted_probs = model.predict(token_list, verbose=0)[0]
        
        predicted_probs = np.log(predicted_probs + 1e-8) / temperature
        predicted_probs = np.exp(predicted_probs) / np.sum(np.exp(predicted_probs))
        
        predicted = top_p_sampling(predicted_probs, p)
        
        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted:
                output_word = word
                break
        
        result += " " + output_word
        generated_words.append(output_word)
    
    result_sentences = []
    sentence = []
    for word in generated_words:
        sentence.append(word)
        if word.endswith(".") or len(sentence) > 10:
            result_sentences.append(" ".join(sentence).capitalize() + ".")
            sentence = []
    if sentence:
        result_sentences.append(" ".join(sentence).capitalize() + ".")
    
    return " ".join(result_sentences)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    seed_text = data.get('seed_text', '')
    if not seed_text:
        return jsonify({'error': 'No seed text provided'}), 400
    generated_recipe = generate_text(seed_text, 50, p=0.9, temperature=1.2)
    return jsonify({'recipe': generated_recipe})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# # TESTING SCRIPT
# user_input = input("Enter a seed text for recipe generation: ")
# generated_recipe = generate_text(user_input, 50, p=0.9, temperature=1.2)  
# print("Generated Recipe Instructions:")
# print(generated_recipe)
