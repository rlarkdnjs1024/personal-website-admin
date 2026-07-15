"use client"

import {RadioGroup, RadioItem} from "@/components/input/radio";
import {useEffect, useState} from "react";
import DatePicker from "@/components/input/date-input";
import {CheckBoxGroup, CheckBoxItem, SingleCheckBox} from "@/components/input/checkbox";
import {TextInput} from "@/components/input/text-input";
import {HashTagInput} from "@/components/input/hash-tag";

export default function Home() {
  const [radioValue, setRadioValue] = useState("PHOTO");
  const [dateValue, setDateValue] = useState("2025-01-01");
  const [topFix, setTopFix] = useState(false);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
      console.log("=================================");
     console.log("radioValue", radioValue);
     console.log("dateValue", dateValue);
     console.log("topFix", topFix);
     console.log("weeks", weeks);
  });

  return (
    <div>
      <main>
        <div>
            <div>
                사진 업로드 형식
            </div>
          <RadioGroup name="radio-test" value={radioValue} onValueChange={setRadioValue}>
              <RadioItem itemValue={"PHOTO"}>
                사진
              </RadioItem>
            <RadioItem itemValue={"POLAROID"}>
              폴라로이드
            </RadioItem>
          </RadioGroup>
        </div>

      <div>
          <div>
              사진 표기 날짜
          </div>
          <DatePicker value={dateValue} onValueChange={setDateValue}/>
      </div>

          <div>
              <SingleCheckBox value={topFix} onValueChange={setTopFix}>
                  상단 고정
              </SingleCheckBox>
          </div>


          <div>
              <div>
                  요일
              </div>
              <CheckBoxGroup name="yoill" values={weeks} onChange={setWeeks}>
                  <CheckBoxItem itemValue="MONDAY">월요일</CheckBoxItem>
                  <CheckBoxItem itemValue="TUESDAY">화요일</CheckBoxItem>
                  <CheckBoxItem itemValue="WEDNESDAY">수요일</CheckBoxItem>
              </CheckBoxGroup>
          </div>

          <div>
              <div>
                  코맨트
              </div>
              <TextInput name="comment" value={comment} onValueChange={setComment} maxLength={100}/>
          </div>


          <div>
              <div>
                  해시태그
              </div>
              <HashTagInput hashtags={hashtags} onChange={setHashtags} maxLength={10} maxCount={5}/>
          </div>
      </main>
    </div>
  );
}
