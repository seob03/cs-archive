---
created: 2026-02-27T21:28:00+09:00
notion-id: 314737bad00c809fbfcbdc33ef3adde4
---
`AnnotationFormatterFactory`는 **“특정 애노테이션이 붙은 필드(파라미터)에 어떤 Formatter(Printer/Parser)를 적용할지 연결해주는 팩토리 (인터페이스)**”다.

스프링의 FormattingConversionService가 타입 변환 또는 포맷팅을 시도하면 필드에 붙은 애노테이션(**@DateTimeFormat, @NumberFormat 같은 것)**을 보고, 그 애노테이션을 처리할 Formatter를 찾는데, 그때 쓰는 연결고리가 AnnotationFormatterFactory다.

---

→ 구현할 때 핵심 메서드는 3개인데 아래와 같이 구현을 하면 된다.

```java
public class MoneyFormatAnnotationFormatterFactory
        implements AnnotationFormatterFactory<MoneyFormat> {

    @Override
    public Set<Class<?>> getFieldTypes() {
        return Set.of(BigDecimal.class);
    }

    @Override
    public Printer<?> getPrinter(MoneyFormat annotation, Class<?> fieldType) {
        return new MoneyFormatter(annotation.pattern(), annotation.suffix());
    }

    @Override
    public Parser<?> getParser(MoneyFormat annotation, Class<?> fieldType) {
        return new MoneyFormatter(annotation.pattern(), annotation.suffix());
    }
}
```

1. `getFieldTypes()` : 이 애노테이션이 적용될 **대상 타입들** 반환
2. `getPrinter(annotation, type)` : **출력용(객체 → 문자열)** Printer 제공
3. `getParser(annotation, type)` : **입력용(문자열 → 객체)** Parser 제공

---

요약하면 “@Xxx 붙으면 이 규칙을 기반으로 문자열 ↔ 객체 변환해라”를 스프링에게 알려주는 인터페이스라고 보면 된다.

### 참고

[[@Custom + AnnotationFormatterFactory로 커스텀 포맷팅 구현]]