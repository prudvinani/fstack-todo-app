"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const UserModel_1 = require("./Model/UserModel");
const app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default.connect('mongodb://localhost:27017/myproduction').then(() => console.log("mongodb is connected"));
const SignupValidation = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API todo" });
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = SignupValidation.parse(req.body);
        const EmailExistied = yield UserModel_1.UserModel.findOne({ email });
        if (EmailExistied) {
            res.status(409).json({ message: "User is already existed in the database" });
        }
        yield UserModel_1.UserModel.create({ email, password });
        res.status(201).json({ message: "User is Created in the database" });
    }
    catch (er) {
        console.log("You can't create the user Signup ");
    }
}));
app.listen(6000, () => {
    console.log("the server is started");
});
