import { Router } from "express";
import { getPagination } from "../utils/utils.js";
import { prisma } from "../lib/prisma.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      company = "",
      location = "",
      tag = "",
      sort = "newest",
      page = "1",
      limit = "10",
    } = req.query;

    console.log(search);

    const pageNum = Number.parseInt(page);
    const limitNum = Number.parseInt(limit);
    const { skip, take } = getPagination(pageNum, limitNum);

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, lte: "insensitive" } },
                { description: { contains: search, lte: "insensitive" } },
              ],
            }
          : {},
        company ? { company: { contains: company, lte: "insensitive" } } : {},
        location
          ? { location: { contains: location, lte: "insensitive" } }
          : {},
        tag ? { tags: { contains: tag, lte: "insensitive" } } : {},
      ],
    };

    let orderBy;
    if (sort === "company") {
      orderBy = { company: "asc" };
    } else if (sort === "oldest") {
      orderBy = { postedAt: "asc" };
    } else {
      orderBy = { postedAt: "desc" };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      jobs,
      total,
      currentPage: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
