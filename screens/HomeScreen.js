import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import color from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addView: false,
      itemName: "",
      itemQuantity: "",
      itemCost: 0,
      items: [],
    };
  }

  componentDidMount() {
    this.setState((state) => ({
      items: [
        ...state.items,
        {
          name: "Biryani",
          quantity: "250gm",
          cost: 120,
        },
      ],
    }));
  }

  addItem = () => {
    console.log(this.state);
    const newItem = {
      name: this.state.itemName,
      quantity: this.state.itemQuantity,
      cost: this.state.itemCost,
    };

    this.setState((prevState) => ({
      items: [...prevState.items, newItem],
      itemName: "",
      itemQuantity: "",
      itemCost: "",
      addView: false,
    }));

    console.log(this.state.items);
  };

  itemDisplay = (item, index) => {
    return (
      <View style={styles.itemDisplayView}>
        <View style={styles.itemDisplayItemDetails}>
          <Text style={styles.itemDisplayName}>{item.name}</Text>
          <Text style={styles.itemDisplayQuantity}>{item.quantity}</Text>
        </View>
        <View style={styles.itemDisplayItemCost}>
          <Text style={styles.itemDisplayCost}>Rs. {item.cost}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Header Start */}
        <View style={styles.header}>
          <Text>ShopIt</Text>
        </View>
        {/* Header End */}

        {/* Content Start */}
        <View style={styles.content}>
          {this.state.addView ? (
            <View style={styles.onAddClick}>
              <View style={styles.addViewTextView}>
                <Text>Enter Details to Add Item -</Text>
              </View>
              <TextInput
                style={styles.addViewTextInput}
                placeholder="Item Name (eg. Chicken Biryani )"
                onChangeText={(text) => this.setState({ itemName: text })}
              />
              <TextInput
                style={styles.addViewTextInput}
                placeholder="Quantity (eg. 250gm )"
                onChangeText={(text) => this.setState({ itemQuantity: text })}
              />
              <TextInput
                style={styles.addViewTextInput}
                placeholder="Cost (eg. Rs.120 )"
                onChangeText={(text) => this.setState({ itemCost: text })}
              />

              <View style={styles.addViewAddCancel}>
                <CustomActionButton
                  style={styles.addViewAddView}
                  styleTouch={styles.addViewAddTouch}
                  onPress={this.addItem}
                >
                  <Text style={styles.addViewAdd}>Add</Text>
                </CustomActionButton>
                <CustomActionButton
                  style={styles.addViewCancelView}
                  styleTouch={styles.addViewAddTouch}
                  onPress={() => this.setState({ addView: false })}
                >
                  <Text style={styles.addViewAdd}>Cancel</Text>
                </CustomActionButton>
              </View>
            </View>
          ) : null}

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{ fontSize: 18, color: color.bgMain, fontWeight: "700" }}
            >
              Items Added -
            </Text>
          </View>
          <FlatList
            data={this.state.items}
            renderItem={({ item }, index) => this.itemDisplay(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* AddButton Start */}
          <TouchableOpacity
            style={styles.addButtonTouch}
            onPress={() => this.setState({ addView: true })}
          >
            <View style={styles.addButton}>
              <Text style={styles.addSign}>+</Text>
            </View>
          </TouchableOpacity>
          {/* AddButton End */}
        </View>
        {/* Content End */}

        {/* Footer Start */}
        <View style={styles.footer}>
          <Text>Footer</Text>
        </View>
        {/* Footer End */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 80,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#0d0d0d",
    borderBottomWidth: 0.5,
  },
  footer: {
    height: 70,
    alignItems: "center",
    borderTopColor: "#0d0d0d",
    borderTopWidth: 0.5,
  },
  content: {
    flex: 1,
  },
  addButtonTouch: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#068068",
    alignItems: "center",
    justifyContent: "center",
  },
  addSign: {
    fontSize: 50,
    fontWeight: "300",
  },
  addViewTextView: {
    alignItems: "center",
    justifyContent: "center",
  },
  addViewTextInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#0d0d0d",
    marginVertical: 5,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  addViewAddCancel: {
    flexDirection: "row",
  },
  addViewAddTouch: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  addViewAddView: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: "green",
    marginBottom: 5,
  },
  addViewCancelView: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    marginBottom: 5,
  },
  addViewAdd: {},
  onAddClick: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#0d0d0d",
  },
  itemDisplayView: {
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: "#0d0d0d",
    padding: 10,
    flexDirection: "row",
    margin: 20,
  },
  itemDisplayItemDetails: {
    flex: 1,
  },
  itemDisplayItemCost: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDisplayName: {
    fontSize: 24,
    fontWeight: "300",
  },
  itemDisplayQuantity: {
    fontSize: 16,
    fontWeight: "100",
  },
  itemDisplayCost: {
    fontSize: 28,
    fontWeight: "300",
  },
});
