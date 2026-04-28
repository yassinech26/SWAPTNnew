package com.cherifyedeshemdenebenhamed.demo.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class ListingStatusConstraintUpdater implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(ListingStatusConstraintUpdater.class);

    private final JdbcTemplate jdbcTemplate;

    public ListingStatusConstraintUpdater(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            jdbcTemplate.execute("""
                DO $$
                DECLARE
                    rec RECORD;
                BEGIN
                    IF to_regclass('public.listings') IS NULL THEN
                        RETURN;
                    END IF;

                    FOR rec IN
                        SELECT conname, pg_get_constraintdef(oid) AS def
                        FROM pg_constraint
                        WHERE conrelid = 'public.listings'::regclass
                          AND contype = 'c'
                          AND pg_get_constraintdef(oid) ILIKE '%status%'
                    LOOP
                        IF rec.def NOT ILIKE '%INACTIVE%' THEN
                            EXECUTE format('ALTER TABLE listings DROP CONSTRAINT %I', rec.conname);
                        END IF;
                    END LOOP;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conrelid = 'public.listings'::regclass
                          AND conname = 'listings_status_check'
                    ) THEN
                        ALTER TABLE listings
                            ADD CONSTRAINT listings_status_check
                            CHECK (status IN ('ACTIVE', 'INACTIVE', 'SOLD'));
                    END IF;
                END $$;
                """);
        } catch (DataAccessException ex) {
            logger.warn("Could not update listings status constraint automatically: {}", ex.getMessage());
        }
    }
}
