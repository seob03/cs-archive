---
created: 2026-02-27T21:41:00+09:00
notion-id: 314737bad00c8076b175cbc6097122de
---
**1) 커스텀 애노테이션 만들기**

```java

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MoneyFormat {
    String pattern() default "#,###"; // DecimalFormat 패턴
    String suffix() default "";       // 예: "원"
}
```

---

**2) Formatter 구현 (parse + print)**

```java
public class MoneyFormatter implements Formatter<BigDecimal> {

    private final String pattern;
    private final String suffix;

    public MoneyFormatter(String pattern, String suffix) {
        this.pattern = pattern;
        this.suffix = suffix;
    }

    @Override
    public BigDecimal parse(String text, Locale locale) throws ParseException {
        if (text == null) return null;

        String trimmed = text.trim();
        if (trimmed.isEmpty()) return null;

        // suffix 제거 (예: "10,000원" -> "10,000")
        if (!suffix.isEmpty() && trimmed.endsWith(suffix)) {
            trimmed = trimmed.substring(0, trimmed.length() - suffix.length()).trim();
        }

        DecimalFormat df = (DecimalFormat) DecimalFormat.getNumberInstance(locale);
        df.applyPattern(pattern);
        df.setParseBigDecimal(true);

        return (BigDecimal) df.parse(trimmed);
    }

    @Override
    public String print(BigDecimal object, Locale locale) {
        if (object == null) return "";

        DecimalFormat df = (DecimalFormat) DecimalFormat.getNumberInstance(locale);
        df.applyPattern(pattern);

        return df.format(object) + suffix;
    }
}
```

---

**3) AnnotationFormatterFactory로 애노테이션 ↔ 포매터 연결**

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

---

**4) 스프링 MVC에 등록 (WebMvcConfigurer)**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatterForFieldAnnotation(new MoneyFormatAnnotationFormatterFactory());
    }
}
```

---

**5) 사용 예시**

```java
// DTO 필드에 적용 (@ModelAttribute / form-data / query-string 바인딩에 적용됨)
public class ItemForm {
    @MoneyFormat(pattern = "#,###", suffix = "원")
    private BigDecimal price;
}
```

```java
// 컨트롤러 파라미터에 적용 (@RequestParam, @PathVariable 등)
@GetMapping("/pay")
public String pay(@RequestParam @MoneyFormat(pattern="#,###", suffix="원") BigDecimal amount) {
    // /pay?amount=10,000원  또는 /pay?amount=10,000
    return amount.toPlainString();
}
```

### 참고

[[AnnotationFormatterFactory]]

[[WebMvcConfigurer]]