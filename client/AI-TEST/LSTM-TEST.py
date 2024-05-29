import tensorflow as tf
from tensorflow.keras.layers import Dense, Embedding, LSTM, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
from sklearn.model_selection import train_test_split

texts = [
    "boil water",
    "cut vegetables",
    "mix ingredients",
    "bake at 350°F for 30 minutes",
    "grill steak for 10 minutes on each side",
    "saute onions and garlic in olive oil",
    "whisk eggs and milk together",
    "season chicken with salt, pepper, and paprika",
    "fry bacon until crispy",
    "simmer tomato sauce for 20 minutes",
    "roast potatoes with rosemary",
    "blend strawberries and bananas for smoothie",
    "steam broccoli for 5 minutes",
    "preheat oven to 375°F",
    "cook pasta in boiling water",
    "slice onions thinly",
    "preheat grill to medium heat",
    "marinate chicken in teriyaki sauce",
    "dice tomatoes for salsa",
    "bake cookies at 350°F for 12 minutes",
    "grate cheese for pizza topping",
    "boil rice in salted water",
    "chop cilantro for garnish",
    "whip cream until stiff peaks form"
]

tokenizer = Tokenizer(filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=True)
tokenizer.fit_on_texts(texts)
vocab_size = len(tokenizer.word_index) + 1

sequences = tokenizer.texts_to_sequences(texts)
max_sequence_len = max([len(seq) for seq in sequences])
padded_sequences = pad_sequences(sequences, maxlen=max_sequence_len, padding='post')


embedding_dim = 100


model = tf.keras.Sequential([
    Embedding(input_dim=vocab_size, output_dim=embedding_dim, input_length=max_sequence_len),
    LSTM(128, return_sequences=True),
    Dropout(0.2),  
    LSTM(128),
    Dropout(0.2), 
    Dense(vocab_size, activation='softmax')
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam')

X_train, X_val, _, _ = train_test_split(padded_sequences, padded_sequences, test_size=0.2, random_state=42)
X_train_target = np.roll(X_train[:, 1:], -1, axis=1)
X_val_target = np.roll(X_val[:, 1:], -1, axis=1)

model.fit(X_train, X_train_target, epochs=50, batch_size=32, validation_data=(X_val, X_val_target))

def generate_recipe(ingredients):
    generated_instructions = []
    for ingredient in ingredients:
        ingredient_seq = tokenizer.texts_to_sequences([ingredient])
        padded_seq = pad_sequences(ingredient_seq, maxlen=max_sequence_len, padding='post')
        generated_idx = np.argmax(model.predict(padded_seq), axis=-1)
        generated_word = tokenizer.index_word[generated_idx[0]]
        generated_instructions.append(generated_word)
    return generated_instructions

# TESTING SCRIPT
user_input = input("Enter random ingredients separated by commas: ").split(',')
generated_instructions = generate_recipe(user_input)
print("Generated Recipe Instructions:")
print(' '.join(generated_instructions))
