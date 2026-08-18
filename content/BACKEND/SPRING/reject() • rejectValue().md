---
created: 2026-02-23T19:37:00+09:00
notion-id: 310737bad00c80cf8164dd3e069340ab
---
`reject()` • `rejectValue()`는 Validator에서 `Errors`(=`BindingResult`)에 에러를 “수동으로 추가”하는 메서드다. `FieldError`와 `ObjectError`를 스프링이 내부적으로 생성해서 `BindingResult`에 넣어주기 때문에 내가 에러 객체들을 `new` 키워드를 통해 직접 생성할 필요가 없다.

```java
void rejectValue(@Nullable String field, 
								String errorCode, 
								@Nullable Object[] errorArgs, 
								@Nullable String defaultMessage);
```

→ **특정 필드에 대한 에러(FieldError)** 추가 ==예: price 값이 범위를 벗어남, quantity가 음수임==

- `field` : 오류 필드명
- `errorCode` : 오류 코드 (errors.properties에서 사용하는 값)
- `errorArgs` : 오류 메시지에서 `{0}` 을 치환하기 위한 값
- `defaultMessage` : 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

```java
void reject(String errorCode, 
						@Nullable Object[] errorArgs, 
						@Nullable String defaultMessage);
```

→ **객체 전체(글로벌) 에러(ObjectError)** 추가==예: price * quantity >= 10,000 같은 “두 필드 조합 규칙” 위반==

---

`reject()`와 `rejectValue()`의 장점은 직접 `FieldError`와 `ObjectError`를 만들어서 추가해야 하는 번거로움도 사라지지만, `BindingResult`의 기반한 메서드라서 target에 대한 정보를 알고 있어서 메서드 파라미터의 길이가 줄어든다는 장점도 있다.

### 참고

[[FieldError • ObjectError]]

[[BindingResult]]