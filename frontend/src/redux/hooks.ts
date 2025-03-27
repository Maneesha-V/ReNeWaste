import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../src/redux/store"; 

export const useAppDispatch = () => useDispatch<AppDispatch>();
