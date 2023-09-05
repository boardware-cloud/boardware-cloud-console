import EventEmitter from "./EventEmitter";
export enum ImagingModeFusionEvent {
    GET_FUSION_ORIGINAL_ING = "GET_FUSION_ORIGINAL_ING",
    GET_FUSION_ORIGINAL_END = "GET_FUSION_ORIGINAL_END",
    CLEAR_FUSION_ORIGINAL = "CLEAR_FUSION_ORIGINAL"
}

const imagingModeFusionEventEmitter = new EventEmitter<ImagingModeFusionEvent>();


export default imagingModeFusionEventEmitter;
