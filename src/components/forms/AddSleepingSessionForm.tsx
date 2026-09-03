"use client";
import { formatDuration } from "@/lib/utils/formatDuration";
import { useActionState, useState } from "react";
import Button from "../ui/Button";
import {
  createSleepingSessionAction,
  CreateSleepingState,
} from "@/lib/actions/sleep/create-sleeping-session";
import { useParams } from "next/navigation";

const initialState: CreateSleepingState = {
  errors: [],
};

const AddSleepingSessionForm = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [state, formAction, pending] = useActionState(
    createSleepingSessionAction,
    initialState,
  );
  const params = useParams<{ babyId: string }>();
  const babyId = params.babyId;

  const duration =
    startTime && endTime
      ? formatDuration(
          new Date(`1970-01-01T${startTime}:00`),
          new Date(`1970-01-01T${endTime}:00`),
        )
      : null;
  return (
    <form action={formAction} className="w-full min-w-0 ">
      {state?.errors && (
        <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
          {state.errors[0]}
        </p>
      )}
      <input type="hidden" name="babyId" value={babyId} />
      <div className="flex justify-between items-center mb-4">
        <label className="flex flex-col text-xs font-semibold text-[#6B7280] ">
          Heure de coucher
          <div className="w-full border border-[#DDE5DF] rounded-xl px-4 py-3 bg-white box-border">
            <input
              type="time"
              name="startAt"
              value={startTime}
              required
              onChange={(e) => setStartTime(e.target.value)}
              className="block w-full min-w-0 border-0 p-0 text-sm bg-transparent outline-none appearance-none text-[#1F2937]"
            />
          </div>
        </label>
        <label className="flex flex-col text-xs font-semibold text-[#6B7280] ">
          Heure de réveil
          <div className="w-full border border-[#DDE5DF] rounded-xl px-4 py-3 bg-white box-border">
            <input
              type="time"
              name="endAt"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="block w-full min-w-0 border-0 p-0 text-sm text-[#1F2937] bg-transparent outline-none appearance-none"
            />
          </div>
        </label>
      </div>
      <div className="w-full p-4 bg-white rounded-xl flex flex-col mb-8">
        <span className="text-xs font-semibold text-[#6B7280]">
          Durée calculée
        </span>
        <span className="text-[#1F2937] text-sm font-semibold">
          {duration ?? "—"}
        </span>
      </div>
      <Button buttonText="✓ Enregistrer le dodo" />
    </form>
  );
};

export default AddSleepingSessionForm;
