import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
  SafeAreaView,
  Button,
  ImagePicker
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

// import {ImagePicker} from 'react-native-image-picker';

const initialIngredient = { name: '', amount: '' };
const initialStep = { type: 'text', text: '' };

const translate_ids = {
  title: "название",
  category: "категория",
  access: "доступ",
  time: "время",
  steps: "этапы приготовления",
  calories: "калории",
  proteins: "белки",
  fats: "жиры",
  carbohydrates: "углеводы",
  ingredients: "ингредиенты",
}

function RecipeInput(props) {
  return (
    <>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.setValue}
        placeholder={props.placeholder}
        style={styles.input}
        keyboardType={props.type}
      />
    </>
  )
}

const CreateRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [access, setAccess] = useState('');
  const [time, setTime] = useState('');
  const [steps, setSteps] = useState([{ type: 'text', text: '' }]);
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [fats, setFats] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [error, setError] = useState();
  const { token } = useContext(AuthContext);
  const [image, setImage] = useState(null);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, { type: 'text', text: '' }]);
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSave = async () => {
    let isValidForm = true;

    const data = {
      sshkey: token,
      title,
      category,
      access: access ? "private" : "public",
      time,
      steps,
      calories,
      proteins,
      fats,
      carbohydrates,
      ingredients,
    };

    Object.keys(data).map((key) => {
      const item = data[key];
      if (item == '' && typeof item != 'boolean') {
        setError(`Поле ${translate_ids[key]} не может быть пустым`);
        isValidForm = false;
      }
    })

    if (error && !isValidForm) {
      alert(error)
      return;
    }

    const formdata = new FormData();
    Object.keys(data).map((key) => {
      const item = data[key];
      data.append(key, item);
    })
    data.append('image', {
      uri: image.uri,
      name: image.fileName || 'image.jpg',
      type: image.type || 'image/jpeg',
    });

    try {
      const res = await axios.post('http://192.168.0.12:8000/api/add_recipes',
        {
          ...data
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      )
      if (res.data.status) {
        alert('Рецепт сохранён!');
        setTitle('');
        setCategory('');
        setAccess('');
        setTime('');
        setSteps([{ type: 'text', text: '' }]);
        setCalories('');
        setProteins('');
        setFats('');
        setCarbohydrates('');
        setIngredients([{ name: '', amount: '' }]);
        navigation.navigate('home');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка.');
    };
  };

  const selectImage = () => {
    ImagePicker.showImagePicker({ title: 'Select Image' }, (response) => {
      if (!response.didCancel && !response.error) {
        setImage(response);
      }
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <RecipeInput label={"Название"} placeholder={"Введите название рецепта"} value={title} setValue={setTitle} />

        <Button title="Выберете изображение" onPress={selectImage} />

        {image && (
          <View>
            <Text>Выбранное изображение:</Text>
            <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
          </View>
        )}

        <Text style={styles.label}>Категория</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={{ borderWidth: 1 }}
        >
          <Picker.Item label="Завтрак" value="lunch" />
          <Picker.Item label="Обед" value="dinner" />
          <Picker.Item label="Ужин" value="breakfast" />
        </Picker>


        <Text style={styles.label}>Доступ</Text>
        <Switch value={access} onValueChange={setAccess} />

        <RecipeInput label={"Время (часы)"} placeholder={"Введите время приготовления в часах"} type="numeric" value={time} setValue={setTime} />

        <Text style={styles.label}>Этапы приготовления</Text>
        {steps.map((step, index) => (
          <View key={index}>
            <TextInput
              value={step.text}
              onChangeText={(text) => {
                const newSteps = [...steps];
                newSteps[index].text = text;
                setSteps(newSteps);
              }}
              placeholder={`Введите этап ${index + 1}`}
              style={styles.input}
            />
            {steps.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                <Text style={styles.removeButton}>Убрать этап</Text>
              </TouchableOpacity>
            )}

          </View>
        ))}
        <TouchableOpacity onPress={handleAddStep}>
          <Text style={styles.addButton}>Добавить этап</Text>
        </TouchableOpacity>


        <RecipeInput label={"Калории"} placeholder={"Введите количество калорий"} type="numeric" value={calories} setValue={setCalories} />
        <RecipeInput label={"Белки"} placeholder={"Введите количество белков"} type="numeric" value={proteins} setValue={setProteins} />
        <RecipeInput label={"Жиры"} placeholder={"Введите количество жиров"} type="numeric" value={fats} setValue={setFats} />
        <RecipeInput label={"Углеводы"} placeholder={"Введите количество углеводов"} type="numeric" value={carbohydrates} setValue={setCarbohydrates} />

        <Text style={styles.label}>Ингредиенты</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index}>
            <TextInput
              value={ingredient.name}
              onChangeText={(name) => {
                const newIngredients = [...ingredients];
                newIngredients[index].name = name;
                setIngredients(newIngredients);
              }}
              placeholder={`Введите название ингредиента`}
              style={styles.input}
            />
            <TextInput
              value={ingredient.amount}
              onChangeText={(amount) => {
                const newIngredients = [...ingredients];
                newIngredients[index].amount = amount;
                setIngredients(newIngredients);
              }}
              placeholder={`Введите количество ингредиента`}
              style={styles.input}
            />
            {ingredients.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
                <Text style={styles.removeButton}>Убрать ингредиент</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={handleAddIngredient}>
          <Text style={styles.addButton}>Добавить ингредиенты</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white'
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Montserrat-Regular",
    color: 'black'
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  addButton: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
    marginBottom: 20,
  },
  removeButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  saveButton: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default CreateRecipeScreen;