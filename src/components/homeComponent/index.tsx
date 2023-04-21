
import ItinBuilder from '../itinBuilder/ItinBuilder'
import MapComponent from "../mapComponent";
import { useRecoilState } from "recoil";
import {curStepState} from "../../atoms/atoms"

export default function HomeComponent() {
  const [curStep, setCurStep] = useRecoilState(curStepState);

console.log("curstep", curStep)
  return (
    <>
       <ItinBuilder />
       {/* {curStep === "110T" && <MapComponent />} */}
    </>
  )
}
