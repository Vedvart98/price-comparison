package com.pricecompare.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;
import org.springframework.data.redis.cache.*;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

import java.time.Duration;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${cache.prices-ttl:300000}")
    private long pricesTtlMs;

    @Value("${cache.categories-ttl:3600000}")
    private long categoriesTtlMs;

    @Value("${cache.products-ttl:600000}")
    private long productsTtlMs;

    @Bean
    public RedisSerializer<Object> redisSerializer() {
        return GenericJacksonJsonRedisSerializer.create(builder ->
            builder.enableUnsafeDefaultTyping().customize(mapperBuilder -> {})
        );
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> tpl = new RedisTemplate<>();
        tpl.setConnectionFactory(factory);
        StringRedisSerializer str = new StringRedisSerializer();
        tpl.setKeySerializer(str);
        tpl.setHashKeySerializer(str);
        tpl.setValueSerializer(redisSerializer());
        tpl.setHashValueSerializer(redisSerializer());
        tpl.afterPropertiesSet();
        return tpl;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration defaultCfg = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMillis(pricesTtlMs))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(redisSerializer()))
            .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> configs = Map.of(
            // Per-cache TTL overrides
            "comparisons",  defaultCfg.entryTtl(Duration.ofMillis(pricesTtlMs)),
            "itemPrices",   defaultCfg.entryTtl(Duration.ofMillis(pricesTtlMs)),
            "categories",   defaultCfg.entryTtl(Duration.ofMillis(categoriesTtlMs)),
            "products",     defaultCfg.entryTtl(Duration.ofMillis(productsTtlMs))
        );

        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaultCfg)
            .withInitialCacheConfigurations(configs)
            .build();
    }
}
