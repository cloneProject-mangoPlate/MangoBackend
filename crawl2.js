import Main from "./models/main.js";
import { app, express } from "./index.js";
let array = [
  [
    "https://media.vlpt.us/images/soujinko/post/3c613f6a-b3da-4c91-adae-c46ae689b567/6.jpg?w=768",
    "1359_korean_pub",
  ],
  [
    "https://media.vlpt.us/images/soujinko/post/09a0c7a1-a7ff-42f0-894e-006720c55b7d/5.jpg?w=768",
    "2858_anju_cheongdam",
  ],
  [
    "https://media.vlpt.us/images/soujinko/post/c17ceeb5-dc60-442f-a049-dcd49c147760/4.jpg?w=768",
    "2857_familydinner_seoraevillage",
  ],
  [
    "https://media.vlpt.us/images/soujinko/post/ee377476-3f7c-4336-94ba-53f3d88dfac3/3.jpg?w=768",
    "979_fried_chicken",
  ],
  [
    "https://media.vlpt.us/images/soujinko/post/c95d270d-6745-43d5-9e47-f9ab6fc58544/2.jpg?w=768",
    "759_jjimdak",
  ],
  [
    "https://media.vlpt.us/images/soujinko/post/81dd9dc3-c318-4f79-af7a-1f065d873adf/1.jpg?w=768",
    "tantannoodle_top5",
  ],
];

const main = async (array) => {
  for (let i = 0; i < array.length; i++) {
    Main.create({
      imgUrl: array[i][0],
      keyword: array[i][1],
    });
  }
};

main(array);
