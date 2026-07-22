import {cn} from "@/lib/utils";
import {JSX} from "react";

type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;

    //한 페이지에 뿌릴 데이터 개수
    pageSize?: number;
    actualSize: number;

    totalPageCount: number
    totalDataLength: number;

    children: React.ReactNode;

    //하단의 페이지 이동 도구에 보여질 버튼의 개수
    buttonCount?: number;
}

export function Pagination ({
    currentPage,
    onPageChange,

    pageSize = 8,
    actualSize,

    totalPageCount,
    totalDataLength,

    children,
    buttonCount = 5,

}: PaginationProps){

    //보여질 버튼 그룹의 페이지
    const currentButtonPage = Math.floor( currentPage / buttonCount ) + (currentPage % buttonCount === 0 ?  0 : 1);

    //페이지 이동 버튼 시작 숫자
    const buttonStart = 1 + buttonCount * (currentButtonPage - 1);

    //페이지 이동 버튼 끝 숫자
    const buttonEnd = Math.min(buttonCount * currentButtonPage, totalPageCount);

    //화면에 보여줄 버튼의 실제 개수
    const displayButtonCount = buttonEnd - buttonStart + 1

    return (
        <>

            {children}

            {/*버튼 메뉴*/}
            { (totalDataLength > 0 && totalPageCount > 1) &&
                (<div className="flex items-center justify-center gap-1 p-2 mt-auto">
                        {
                            totalPageCount > buttonCount && (
                                <button
                                    className="rounded border px-2 py-1 cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    onClick={() => onPageChange(1)}
                                    disabled={currentPage === 1}
                                >
                                    {"<<"}
                                </button>
                            )
                        }

                    <button
                        className="rounded border px-2 py-1 cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {"<"}
                    </button>
                    {Array.from({length: displayButtonCount}, (_, i) => (i+buttonStart)).map(i => (
                        <button
                            key={i}
                            className={cn(
                                "rounded border px-2 py-1 cursor-pointer hover:bg-gray-100",
                                currentPage === i && "bg-gray-800 text-white border-gray-800 hover:bg-gray-800"
                            )}
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </button>
                    ))}
                    <button
                        className="rounded border px-2 py-1 cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPageCount))}
                        disabled={currentPage === totalPageCount}
                    >
                        {">"}
                    </button>

                    {
                        totalPageCount > buttonCount && (
                            <button
                                className="rounded border px-2 py-1 cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                onClick={() => onPageChange(totalPageCount)}
                                disabled={currentPage === totalPageCount}
                            >
                                {">>"}
                            </button>
                        )
                    }

                </div>
                )
            }

        </>

    )
}
