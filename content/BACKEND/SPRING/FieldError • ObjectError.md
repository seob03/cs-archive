---
created: 2026-02-23T19:44:00+09:00
notion-id: 310737bad00c80d78cdff2c821d6bcf0
---
- **FieldError**: 특정 필드 1개에 대한 에러
	- 예) age=abc → Integer age 변환 실패(typeMismatch)
	- 예) name=""인데 `@NotBlank` 위반
- **ObjectError**(Global Error): 객체 전체 규칙에 대한 에러(보통 필드 조합/교차 검증)
	- 예) startDate <= endDate 규칙 위반
	- 예) price * quantity >= 10000 같은 비즈니스 룰 위반

---

## **ObjectError 생성자 (2개)**

```java
ObjectError(String objectName, @Nullable String defaultMessage)
```

- `objectName`: 에러가 난 **객체 이름**(보통 모델 attribute 이름)
- `defaultMessage`: 메시지 코드로 못 찾을 때 쓰는 **기본 메시지**

```java
ObjectError(String objectName, 
						@Nullable String[] codes, 
						@Nullable Object[] arguments, 
						@Nullable String defaultMessage
)
```

- `codes`: 메시지 소스에서 찾을 **메시지 코드 후보들**
- `arguments`: 메시지 치환에 들어갈 **파라미터들**
- `defaultMessage`: 최후의 기본 메시지

## **FieldError 생성자 (2개)**

```java
FieldError(String objectName, String field, String defaultMessage)
```

- `field`: 에러가 난 **필드명**
- `defaultMessage`: 기본 메시지

```java
FieldError(String objectName, 
						String field, 
						@Nullable Object rejectedValue, 
						boolean bindingFailure, 
						@Nullable String[] codes, 
						@Nullable Object[] arguments, 
						@Nullable String defaultMessage
)
```

- `rejectedValue`: 사용자가 넣은 **거절된 값**(예: "abc")
- `bindingFailure`: **바인딩 실패**인지 여부(타입미스매치 같은 거면 true, 검증 실패면 false)
- `codes/arguments/defaultMessage`: `ObjectError`랑 동일 의미