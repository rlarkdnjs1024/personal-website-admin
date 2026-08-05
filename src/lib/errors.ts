// 요청 처리 중 발생하는 에러의 최상위 클래스.
// API route는 이 클래스(및 자식)를 catch해서 적절한 HTTP status로 변환한다.
export class RequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RequestError";
    }
}

// request.json()이 유효한 JSON을 파싱하지 못했을 때.
export class JsonParseError extends RequestError {
    constructor(message = "Request body is not valid JSON.") {
        super(message);
        this.name = "JsonParseError";
    }
}

// zod 등으로 검증한 입력값(JSON body, query parameter 등)이 스키마와 맞지 않을 때.
export class ValidationError extends RequestError {
    readonly issues?: unknown;

    constructor(message: string, issues?: unknown) {
        super(message);
        this.name = "ValidationError";
        this.issues = issues;
    }
}
