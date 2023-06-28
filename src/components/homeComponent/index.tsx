
import ItinBuilder from '../itinBuilder/ItinBuilder'
// import MapComponent from "../mapComponent";
import { useRecoilState } from "recoil";
import {curStepState} from "../../atoms/atoms"
import styles from "./homeComponent.module.css"

export default function HomeComponent() {
  const [curStep, setCurStep] = useRecoilState(curStepState);

  return (
    <div className={styles.homeComponent}>
       <ItinBuilder />
       {/* {curStep === "110T" && <MapComponent />} */}
    </div>
  )
}
