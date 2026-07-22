"use client"

import {RadioGroup, RadioItem} from "@/components/common/input/radio";
import {useEffect, useState} from "react";
import DatePicker from "@/components/common/input/date-input";
import {CheckBoxGroup, CheckBoxItem, SingleCheckBox} from "@/components/common/input/checkbox";
import {TextInput} from "@/components/common/input/text-input";
import {HashTagInput} from "@/components/common/input/hash-tag";
import {FONTS} from "@/fonts/fonts";
import {cn} from "@/lib/utils";
import {Pagination} from "@/components/common/pagination";
import {paginateList} from "@/lib/utils";
import {ColorPicker} from "@/components/common/color-picker";
import {ImageSelector, UploadImage} from "@/components/common/image-selector";


export default function Home() {
  const [radioValue, setRadioValue] = useState("PHOTO");
  const [dateValue, setDateValue] = useState("2025-01-01");
  const [topFix, setTopFix] = useState(false);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [font, setFont] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [color, setColor] = useState<string>("#FFFDF8");
  const [image, setImage] = useState<UploadImage|null>(null);

  useEffect(() => {
      console.log("=================================");
     console.log("radioValue", radioValue);
     console.log("dateValue", dateValue);
     console.log("topFix", topFix);
     console.log("weeks", weeks);
     console.log("color", color);
  });

  const PAGE_SIZE = 10;
  const pagedResult = paginateList({sourceList: FONTS, pageSize: PAGE_SIZE, page: currentPage});

  return (
      <div>
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
              <div >
                  Hashtags
              </div>
              <HashTagInput hashtags={hashtags} onChange={setHashtags} maxLength={10} maxCount={5}/>
          </div>

          <div>
              <div >
                  Font
              </div>
              <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}

                  totalPageCount={pagedResult.totalPageCount}
                  totalDataLength={pagedResult.totalDataLength}

                  pageSize={PAGE_SIZE}
                  actualSize={pagedResult.actualSize}
              >
                  { pagedResult.pagedList.map(x => (
                      <div key={x.id}>
                          <button
                              className="w-full flex items-center hover:bg-gray-100 hover:cursor-pointer border-b-blue-800"
                              onClick={() => setFont(x.id)}
                          >
                              <span>{x.label}</span>
                              <span className={cn("flex-1 text-center", x.className)}>Summer of 69</span>
                              <span className="w-4 text-right">{font === x.id && <>&#10004;</>}</span>
                          </button>
                      </div>
                  ))}
              </Pagination>
          </div>

          <div>
              색깔
              <ColorPicker value={color} onValueChange={setColor} name={"color"}/>
          </div>

          <div>
              미리보기 영역
          </div>

          <div>
              사진 선택
          </div>

          <div>
              <RectanglePolaroidPreview/>
          </div>

      </div>
  );
}

function RectanglePolaroidPreview () {
    return (
        <div className="flex flex-col items-center">
            <div
                className="w-1/2 [aspect-ratio:1/1.6] [container-type:inline-size] [rotate:3deg] px-[0.5%] pt-[1%] pb-[0.5%] bg-blue-50 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                <img
                    src="/img_conver_test.jpg"
                    className="mb-[1%] block w-full aspect-[1/1.3] object-cover"
                />

                <div className="text-[7cqw]">
            <span>
                2026.11.14
                <br/>
                Napolitan spaghetti with Seryoen
            </span>
                </div>
            </div>
        </div>

    )
}
